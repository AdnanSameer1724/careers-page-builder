'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Building, Calendar } from 'lucide-react'
import type { Job } from '@/types/database.types'
import { formatDistanceToNow } from 'date-fns'

interface JobDetailsModalProps {
  job: Job | null
  open: boolean
  onClose: () => void
}

export default function JobDetailsModal({ job, open, onClose }: JobDetailsModalProps) {
  if (!job) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Meta */}
          <div className="flex flex-wrap gap-3">
            {job.location && (
              <Badge variant="secondary" className="gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </Badge>
            )}
            {job.job_type && (
              <Badge variant="secondary" className="gap-1">
                <Briefcase className="w-3 h-3" />
                {job.job_type}
              </Badge>
            )}
            {job.department && (
              <Badge variant="secondary" className="gap-1">
                <Building className="w-3 h-3" />
                {job.department}
              </Badge>
            )}
            <Badge variant="outline" className="gap-1">
              <Calendar className="w-3 h-3" />
              Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
            </Badge>
          </div>

          {/* Description */}
          {job.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">About the Role</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          {/* Apply Button */}
          <div className="pt-4 border-t">
            <Button className="w-full" size="lg">
              Apply for this Position
            </Button>
            <p className="text-sm text-gray-500 text-center mt-2">
              You'll be redirected to the application form
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}