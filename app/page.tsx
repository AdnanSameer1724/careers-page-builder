import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Briefcase, Building2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: companies, error } = await supabase
    .from('companies')
    .select('*')
  
  if (error) {
    console.error('Error fetching companies:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Careers Page Builder
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The modern ATS platform for creating beautiful, branded careers pages that attract top talent
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="gap-2 text-lg px-8">
                  For Recruiters
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Companies
          </h2>
          <p className="text-gray-600">
            Explore open positions from leading organizations
          </p>
        </div>

        {companies && companies.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Link
                key={company.id}
                href={`/${company.slug}/careers`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
                  <div className="flex items-start gap-4">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                        style={{ backgroundColor: company.brand_primary_color }}
                      >
                        {company.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </h3>
                      {company.tagline && (
                        <p className="text-sm text-gray-600 mt-1">
                          {company.tagline}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                    View Open Positions
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No companies found</p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Customization</h3>
              <p className="text-gray-600 text-sm">
                Customize colors, logos, and content to match your brand
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Mobile Optimized</h3>
              <p className="text-gray-600 text-sm">
                Beautiful on all devices, from desktop to mobile
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">SEO Ready</h3>
              <p className="text-gray-600 text-sm">
                Optimized for search engines to attract more candidates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Careers Page Builder. Built for Whitecarrot Assignment.
          </p>
        </div>
      </footer>
    </div>
  )
}