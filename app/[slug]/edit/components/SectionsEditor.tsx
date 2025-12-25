'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Save } from 'lucide-react'
import type { CompanySection } from '@/types/database.types'
import { useRouter } from 'next/navigation'

interface SectionsEditorProps {
  companyId: string
  initialSections: CompanySection[]
}

export default function SectionsEditor({ companyId, initialSections }: SectionsEditorProps) {
  const router = useRouter()
  const [sections, setSections] = useState(initialSections)
  const [loading, setLoading] = useState(false)

  const addSection = () => {
    const newSection: CompanySection = {
      id: `temp-${Date.now()}`,
      company_id: companyId,
      section_type: 'custom',
      title: '',
      content: '',
      order_index: sections.length,
      created_at: new Date().toISOString(),
    }
    setSections([...sections, newSection])
  }

  const updateSection = (id: string, field: string, value: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const deleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id))
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < sections.length) {
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]]
      setSections(newSections.map((s, i) => ({ ...s, order_index: i })))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, sections }),
      })
      
      if (response.ok) {
        alert('✅ Sections saved!')
        router.refresh()
      } else {
        const data = await response.json()
        alert(`❌ Failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Sections</CardTitle>
        <CardDescription>Add and organize content sections for your careers page</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.id} className="border rounded-lg p-4 space-y-3 bg-white">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1 pt-2">
                <button
                  type="button"
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded disabled:opacity-30 text-lg font-bold"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sections.length - 1}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded disabled:opacity-30 text-lg font-bold"
                  title="Move down"
                >
                  ↓
                </button>
              </div>
              
              <div className="flex-1 space-y-3">
                <Input
                  placeholder="Section Title (e.g., About Us)"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                  className="font-semibold"
                />
                <Textarea
                  placeholder="Section Content"
                  value={section.content || ''}
                  onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => deleteSection(section.id)}
                className="mt-2 text-black"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" onClick={addSection} className="gap-2">
            <Plus className="w-4 h-4" /> Add Section
          </Button>
          <Button onClick={handleSave} disabled={loading} className="gap-2 ml-auto">
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save All Sections'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}