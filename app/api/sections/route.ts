import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { companyId, sections } = await request.json()
    const supabase = await createClient()

    // Delete existing sections
    const { error: deleteError } = await supabase
      .from('company_sections')
      .delete()
      .eq('company_id', companyId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    // Insert new sections
    const sectionsToInsert = sections
      .filter((s: any) => s.title.trim() !== '') // Only save non-empty sections
      .map((s: any, i: number) => ({
        company_id: companyId,
        section_type: s.section_type || 'custom',
        title: s.title,
        content: s.content || '',
        order_index: i,
      }))

    if (sectionsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('company_sections')
        .insert(sectionsToInsert)

      if (insertError) {
        console.error('Insert error:', insertError)
        return NextResponse.json({ error: insertError.message }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message || 'Failed to save sections' }, { status: 500 })
  }
}