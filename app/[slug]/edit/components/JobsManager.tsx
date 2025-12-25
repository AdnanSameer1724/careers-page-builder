'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Briefcase } from 'lucide-react'
import type { Job } from '@/types/database.types'
import { useRouter } from 'next/navigation'

interface JobsManagerProps {
  companyId: string
  initialJobs: Job[]
}

export default function JobsManager({ companyId, initialJobs }: JobsManagerProps) {
  const router = useRouter()
  const [jobs, setJobs] = useState(initialJobs)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    job_type: 'Full-time',
    department: '',
    description: '',
    requirements: '',
  })

  const openDialog = (job?: Job) => {
    if (job) {
      setEditingJob(job)
      setFormData({
        title: job.title,
        location: job.location || '',
        job_type: job.job_type || 'Full-time',
        department: job.department || '',
        description: job.description || '',
        requirements: job.requirements || '',
      })
    } else {
      setEditingJob(null)
      setFormData({
        title: '',
        location: '',
        job_type: 'Full-time',
        department: '',
        description: '',
        requirements: '',
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      const url = editingJob ? `/api/jobs/${editingJob.id}` : '/api/jobs'
      const method = editingJob ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, company_id: companyId }),
      })

      if (response.ok) {
        alert('✅ Job saved!')
        setIsDialogOpen(false)
        router.refresh()
      } else {
        const data = await response.json()
        alert(`❌ Failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error occurred')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    
    try {
      const response = await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
      if (response.ok) {
        alert('✅ Job deleted!')
        router.refresh()
      } else {
        const data = await response.json()
        alert(`❌ Failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error occurred')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Job Listings
            </CardTitle>
            <CardDescription>Manage open positions</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()} className="gap-2">
                <Plus className="w-4 h-4" /> Add Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingJob ? 'Edit Job' : 'Add New Job'}</DialogTitle>
                <DialogDescription>Fill in the job details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Developer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Remote"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Type</Label>
                    <Select value={formData.job_type} onValueChange={(v) => setFormData({ ...formData, job_type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Engineering"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Job description..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Requirements</Label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={4}
                    placeholder="Job requirements..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Job</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 transition-colors">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.location} • {job.job_type}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openDialog(job)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(job.id)}
                  className='text-black'
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <p className="text-center text-gray-500 py-8">No jobs yet. Add your first job!</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}