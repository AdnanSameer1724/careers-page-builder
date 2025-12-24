import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CompanyHeader from './components/CompanyHeader'
import CompanySection from './components/CompanySection'
import JobCard from './components/JobCard'
import JobFilters from './components/JobFilters'
import type { Company, CompanySection as Section, Job } from '@/types/database.types'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CareersPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const search = await searchParams
  
  const supabase = await createClient()

  // Fetch company data
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (companyError || !company) {
    notFound()
  }

  // Fetch company sections
  const { data: sections } = await supabase
    .from('company_sections')
    .select('*')
    .eq('company_id', company.id)
    .order('order_index', { ascending: true })

  // Fetch jobs with filters
  let jobsQuery = supabase
    .from('jobs')
    .select('*')
    .eq('company_id', company.id)
    .eq('is_active', true)

  // Apply filters from URL params
  const searchTerm = search.search as string
  const location = search.location as string
  const jobType = search.type as string

  if (searchTerm) {
    jobsQuery = jobsQuery.ilike('title', `%${searchTerm}%`)
  }
  if (location && location !== 'all') {
    jobsQuery = jobsQuery.eq('location', location)
  }
  if (jobType && jobType !== 'all') {
    jobsQuery = jobsQuery.eq('job_type', jobType)
  }

  const { data: jobs } = await jobsQuery.order('created_at', { ascending: false })

  // Get unique locations and job types for filters
  const { data: allJobs } = await supabase
    .from('jobs')
    .select('location, job_type')
    .eq('company_id', company.id)
    .eq('is_active', true)

  const locations = [...new Set(allJobs?.map(j => j.location).filter(Boolean))]
  const jobTypes = [...new Set(allJobs?.map(j => j.job_type).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader company={company} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Company Sections */}
        {sections && sections.length > 0 && (
          <div className="mb-16 space-y-12">
            {sections.map((section) => (
              <CompanySection key={section.id} section={section} />
            ))}
          </div>
        )}

        {/* Jobs Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Open Positions
            </h2>
            <p className="text-gray-600">
              Join our team and help us build the future
            </p>
          </div>

          <JobFilters 
            locations={locations} 
            jobTypes={jobTypes}
            currentSearch={searchTerm}
            currentLocation={location}
            currentType={jobType}
          />

          {/* Jobs Grid */}
          <div className="mt-8">
            {jobs && jobs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} companySlug={slug} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">
                  No positions match your criteria
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

// Add metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: company } = await supabase
    .from('companies')
    .select('name, tagline, banner_image_url')
    .eq('slug', slug)
    .single()

  if (!company) {
    return {
      title: 'Careers',
    }
  }

  return {
    title: `Careers at ${company.name}`,
    description: company.tagline || `Join the team at ${company.name}. View open positions and apply today.`,
    openGraph: {
      title: `Careers at ${company.name}`,
      description: company.tagline || `Join the team at ${company.name}`,
      images: company.banner_image_url ? [company.banner_image_url] : [],
    },
  }
}