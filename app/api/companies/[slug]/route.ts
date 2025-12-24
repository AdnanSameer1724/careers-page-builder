import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const supabase = await createClient()

    // Update company
    const { data, error } = await supabase
      .from('companies')
      .update({
        name: body.name,
        tagline: body.tagline,
        logo_url: body.logo_url,
        banner_image_url: body.banner_image_url,
        culture_video_url: body.culture_video_url,
        brand_primary_color: body.brand_primary_color,
        brand_secondary_color: body.brand_secondary_color,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}