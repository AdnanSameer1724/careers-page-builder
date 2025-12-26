'use client'

import { TabsTrigger } from '@/components/ui/tabs'
import { Paintbrush, LayoutGrid, Briefcase } from 'lucide-react'

const iconMap: Record<string, any> = {
  branding: Paintbrush,
  sections: LayoutGrid,
  jobs: Briefcase,
}

export default function IconTab({
  value,
  label,
}: {
  value: string
  label: string
}) {
  const Icon = iconMap[value]

  return (
    <TabsTrigger
      value={value}
      className="
        group relative
        w-11 h-11
        flex items-center justify-center
        rounded-2xl
        bg-transparent
        text-white/40
        hover:text-white
        transition-all
        data-[state=active]:text-white
        data-[state=active]:bg-white/10
        cursor-pointer
      "
    >
      {/* ICON */}
      <Icon className="size-10"
      />

      {/* HOVER LABEL */}
      <span
        className="
          absolute left-16
          whitespace-nowrap
          rounded-md bg-black/90 text-white text-xs
          px-2 py-1
          opacity-0 group-hover:opacity-100
          transition
          pointer-events-none
        "
      >
        {label}
      </span>
    </TabsTrigger>
  )
}
