import type { Job } from '@/types/database.types'
import { MapPin, Briefcase, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface JobCardProps {
  job: Job
  companySlug: string
}

export default function JobCard({ job, companySlug }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200">
      <div className="flex flex-col h-full">
        {/* Job Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {job.title}
        </h3>

        {/* Job Meta Info */}
        <div className="space-y-2 mb-4">
          {job.location && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{job.location}</span>
            </div>
          )}
          
          {job.job_type && (
            <div className="flex items-center text-gray-600 text-sm">
              <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{job.job_type}</span>
            </div>
          )}

          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Department Badge */}
        {job.department && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              {job.department}
            </span>
          </div>
        )}

        {/* Job Description Preview */}
        {job.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {job.description}
          </p>
        )}

        {/* View Details Button */}
        <div className="mt-auto">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}