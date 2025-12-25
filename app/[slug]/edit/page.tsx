import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BrandingEditor from './components/BrandingEditor'
import SectionsEditor from './components/SectionsEditor'
import JobsManager from './components/JobsManager'
import PreviewButton from './components/PreviewButton'
import LogoutButton from './components/LogoutButton'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EditPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch company data
  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !company) {
    notFound()
  }

  // Fetch sections
  const { data: sections } = await supabase
    .from('company_sections')
    .select('*')
    .eq('company_id', company.id)
    .order('order_index', { ascending: true })

  // Fetch jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {company.name}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Customize your careers page
        </p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <PreviewButton slug={slug} />
        <LogoutButton />
      </div>
    </div>
  </div>
</header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="branding" className="space-y-6">
  <div className="overflow-x-auto">
    <TabsList className="inline-flex w-full sm:w-auto min-w-full sm:min-w-0">
      <TabsTrigger value="branding" className="flex-1 sm:flex-none">
        Branding
      </TabsTrigger>
      <TabsTrigger value="sections" className="flex-1 sm:flex-none">
        Sections
      </TabsTrigger>
      <TabsTrigger value="jobs" className="flex-1 sm:flex-none">
        Jobs
      </TabsTrigger>
    </TabsList>
  </div>

          <TabsContent value="branding" className="space-y-6">
            <BrandingEditor company={company} />
          </TabsContent>

          <TabsContent value="sections" className="space-y-6">
            <SectionsEditor 
              companyId={company.id} 
              initialSections={sections || []} 
            />
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <JobsManager 
              companyId={company.id} 
              initialJobs={jobs || []} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  return {
    title: `Edit Careers Page - ${slug}`,
  }
}