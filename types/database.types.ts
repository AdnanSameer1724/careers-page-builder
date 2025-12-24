export interface Company {
  id: string
  slug: string
  name: string
  logo_url: string | null
  brand_primary_color: string
  brand_secondary_color: string
  banner_image_url: string | null
  culture_video_url: string | null
  tagline: string | null
  created_at: string
  updated_at: string
}

export interface CompanySection {
  id: string
  company_id: string
  section_type: string
  title: string
  content: string | null
  order_index: number
  created_at: string
}

export interface Job {
  id: string
  company_id: string
  title: string
  location: string | null
  job_type: string | null
  department: string | null
  description: string | null
  requirements: string | null
  is_active: boolean
  created_at: string
}