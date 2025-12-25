import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const jobData = {
      company_id: body.company_id,
      title: body.title,
      location: body.location || null,
      job_type: body.job_type || 'Full-time',
      department: body.department || null,
      description: body.description || null,
      requirements: body.requirements || null,
      is_active: true,
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single()

    if (error) {
      console.error('Job insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create job' }, { status: 500 })
  }
}