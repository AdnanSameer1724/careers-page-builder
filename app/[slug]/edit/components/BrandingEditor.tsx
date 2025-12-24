'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Palette, Image as ImageIcon, Video, Save } from 'lucide-react'
import type { Company } from '@/types/database.types'
import { useRouter } from 'next/navigation'

interface BrandingEditorProps {
  company: Company
}

export default function BrandingEditor({ company }: BrandingEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: company.name,
    tagline: company.tagline || '',
    logo_url: company.logo_url || '',
    banner_image_url: company.banner_image_url || '',
    culture_video_url: company.culture_video_url || '',
    brand_primary_color: company.brand_primary_color,
    brand_secondary_color: company.brand_secondary_color,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/companies/${company.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('✅ Branding updated successfully!')
        router.refresh()
      } else {
        alert('❌ Failed to update branding')
      }
    } catch (error) {
      console.error('Error updating branding:', error)
      alert('❌ An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Brand Identity
          </CardTitle>
          <CardDescription>
            Customize your company's visual identity and messaging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your Company Name"
              required
            />
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="A catchy tagline for your company"
            />
          </div>

          {/* Brand Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Brand Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={formData.brand_primary_color}
                  onChange={(e) => setFormData({ ...formData, brand_primary_color: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.brand_primary_color}
                  onChange={(e) => setFormData({ ...formData, brand_primary_color: e.target.value })}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Brand Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={formData.brand_secondary_color}
                  onChange={(e) => setFormData({ ...formData, brand_secondary_color: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.brand_secondary_color}
                  onChange={(e) => setFormData({ ...formData, brand_secondary_color: e.target.value })}
                  placeholder="#1e40af"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <Label htmlFor="logo" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Logo URL
            </Label>
            <Input
              id="logo"
              type="url"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
            {formData.logo_url && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <img 
                  src={formData.logo_url} 
                  alt="Logo preview" 
                  className="h-20 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150'
                  }}
                />
              </div>
            )}
          </div>

          {/* Banner URL */}
          <div className="space-y-2">
            <Label htmlFor="banner" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Banner Image URL
            </Label>
            <Input
              id="banner"
              type="url"
              value={formData.banner_image_url}
              onChange={(e) => setFormData({ ...formData, banner_image_url: e.target.value })}
              placeholder="https://example.com/banner.jpg"
            />
            {formData.banner_image_url && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <img 
                  src={formData.banner_image_url} 
                  alt="Banner preview" 
                  className="w-full h-40 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/1200x300'
                  }}
                />
              </div>
            )}
          </div>

          {/* Culture Video */}
          <div className="space-y-2">
            <Label htmlFor="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Culture Video URL (YouTube/Vimeo embed)
            </Label>
            <Input
              id="video"
              type="url"
              value={formData.culture_video_url}
              onChange={(e) => setFormData({ ...formData, culture_video_url: e.target.value })}
              placeholder="https://www.youtube.com/embed/..."
            />
            <p className="text-xs text-gray-500">
              Use the embed URL format for YouTube or Vimeo videos
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}