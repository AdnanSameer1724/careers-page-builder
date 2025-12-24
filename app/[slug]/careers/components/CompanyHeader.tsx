import type { Company } from '@/types/database.types'
import Image from 'next/image'

interface CompanyHeaderProps {
  company: Company
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <div className="relative">
      {/* Banner */}
      <div 
        className="h-64 sm:h-80 lg:h-96 w-full"
        style={{
          backgroundColor: company.brand_primary_color,
          backgroundImage: company.banner_image_url 
            ? `url(${company.banner_image_url})` 
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      </div>

      {/* Company Info */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 sm:-mt-20 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          {/* Logo */}
          {company.logo_url ? (
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-white shadow-xl ring-4 ring-white">
              <Image
                src={company.logo_url}
                alt={`${company.name} logo`}
                fill
                className="object-contain p-4"
              />
            </div>
          ) : (
            <div 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-white"
              style={{ backgroundColor: company.brand_primary_color }}
            >
              {company.name.charAt(0)}
            </div>
          )}

          {/* Company Name and Tagline */}
          <div className="flex-1 text-center sm:text-left pb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              {company.name}
            </h1>
            {company.tagline && (
              <p className="text-lg sm:text-xl text-gray-600">
                {company.tagline}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Culture Video (if exists) */}
      {company.culture_video_url && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={company.culture_video_url}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  )
}