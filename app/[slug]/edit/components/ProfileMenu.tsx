'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, LogOut } from 'lucide-react'

export default function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="
          w-11 h-11 rounded-full
          bg-white/10 text-white
          flex items-center justify-center
          hover:bg-white/20
          transition
        "
      >
        <User size={22} />
      </button>

      {open && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-white border rounded-lg shadow w-36">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
