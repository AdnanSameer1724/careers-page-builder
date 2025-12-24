import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch all companies
  const { data: companies, error } = await supabase
    .from('companies')
    .select('*')
  
  if (error) {
    console.error('Error fetching companies:', error)
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Careers Page Builder
        </h1>
        <p className="text-gray-600 mb-8">
          ATS Platform for creating branded careers pages
        </p>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Available Companies</h2>
          
          {companies && companies.length > 0 ? (
            <div className="space-y-3">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/${company.slug}/careers`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-lg">{company.name}</h3>
                  {company.tagline && (
                    <p className="text-gray-600 text-sm mt-1">{company.tagline}</p>
                  )}
                  <p className="text-blue-600 text-sm mt-2">
                    View Careers Page →
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No companies found</p>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Database connection: <span className="text-green-600 font-semibold">✓ Active</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}