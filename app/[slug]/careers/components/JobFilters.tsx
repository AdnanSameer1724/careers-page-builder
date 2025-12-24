'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, MapPin, Briefcase, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface JobFiltersProps {
  locations: string[]
  jobTypes: string[]
  currentSearch?: string
  currentLocation?: string
  currentType?: string
}

export default function JobFilters({ 
  locations, 
  jobTypes,
  currentSearch,
  currentLocation,
  currentType
}: JobFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState(currentSearch || '')
  const [selectedLocation, setSelectedLocation] = useState(currentLocation || 'all')
  const [selectedType, setSelectedType] = useState(currentType || 'all')

  // Update filters in URL
  const updateFilters = (search: string, location: string, type: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    
    if (location && location !== 'all') {
      params.set('location', location)
    } else {
      params.delete('location')
    }
    
    if (type && type !== 'all') {
      params.set('type', type)
    } else {
      params.delete('type')
    }
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters(searchTerm, selectedLocation, selectedType)
  }

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value)
    updateFilters(searchTerm, value, selectedType)
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
    updateFilters(searchTerm, selectedLocation, value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedLocation('all')
    setSelectedType('all')
    router.push(pathname)
  }

  const hasActiveFilters = searchTerm || selectedLocation !== 'all' || selectedType !== 'all'

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search job titles..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </form>

        {/* Location Filter */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <select
            value={selectedLocation}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
          >
            <option value="all">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type Filter */}
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
          >
            <option value="all">All Types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}