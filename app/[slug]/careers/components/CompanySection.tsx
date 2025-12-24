import type { CompanySection } from '@/types/database.types'

interface CompanySectionProps {
  section: CompanySection
}

export default function CompanySection({ section }: CompanySectionProps) {
  return (
    <section className="bg-white rounded-xl shadow-sm p-8 sm:p-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
        {section.title}
      </h2>
      <div className="prose prose-lg max-w-none text-gray-600">
        <p className="whitespace-pre-line">{section.content}</p>
      </div>
    </section>
  )
}