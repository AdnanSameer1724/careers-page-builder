import Link from 'next/link'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PreviewButtonProps {
  slug: string
}

export default function PreviewButton({ slug }: PreviewButtonProps) {
  return (
    <Link href={`/${slug}/careers`} target="_blank">
      <Button variant="outline" className="gap-2">
        <Eye className="w-4 h-4" />
        Preview Page
      </Button>
    </Link>
  )
}