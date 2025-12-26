import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'

import BrandingEditor from './components/BrandingEditor'
import SectionsEditor from './components/SectionsEditor'
import JobsManager from './components/JobsManager'
import PreviewButton from './components/PreviewButton'

import IconTab from './components/IconTab'
import ProfileMenu from './components/ProfileMenu'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EditPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !company) notFound()

  const { data: sections } = await supabase
    .from('company_sections')
    .select('*')
    .eq('company_id', company.id)
    .order('order_index', { ascending: true })

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex min-h-screen bg-[#1f1f2b]">

      {/* OUTER FLEX CONTROLS LAYOUT */}
      <div className="flex w-full">


        {/* TABS CONTROLS STATE ONLY */}
        <Tabs defaultValue="branding" className="w-full">

          <div className="flex justify-between items-center m-6 px-8 text-white">
              <div>
                <h1 className="text-4xl font-semibold mb-2">
                  {company.name}
                </h1>
                <p className="text-lg text-gray-500">
                  Customize branding, sections, and job listings
                </p>
              </div>
              <PreviewButton slug={slug} />
            </div>

          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="w-20 flex flex-col p-4 fixed left-0 top-0 bottom-0">

            {/* CENTER ICON TABS */}
            <div className="flex-1 flex items-center justify-center">
              <TabsList className="flex flex-col gap-16 bg-transparent p-0">
                <IconTab value="branding" label="Branding"/>
                <IconTab value="sections" label="Sections" />
                <IconTab value="jobs" label="Jobs" />
              </TabsList>
            </div>

            {/* PROFILE AT BOTTOM (SLIGHTLY UP) */}
            <div className="flex justify-center mb-4">
              <ProfileMenu />
            </div>
          </aside>


          {/* ================= MAIN CONTENT ================= */}
          <main className="flex-1 ml-16 px-8 py-6">

            

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <TabsContent value="branding">
                <BrandingEditor company={company} />
              </TabsContent>

              <TabsContent value="sections">
                <SectionsEditor
                  companyId={company.id}
                  initialSections={sections || []}
                />
              </TabsContent>

              <TabsContent value="jobs">
                <JobsManager
                  companyId={company.id}
                  initialJobs={jobs || []}
                />
              </TabsContent>
            </div>

          </main>
        </Tabs>
      </div>
    </div>
  )
}
