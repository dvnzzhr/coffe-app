"use client"

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 2) {
      router.back()
    } else {
      const mode = localStorage.getItem('lastSearchMode') || 'surabaya'
      const q = localStorage.getItem('lastSearchQuery') || ''
      router.push(`/map?mode=${mode}${q ? `&q=${q}` : ''}`)
    }
  }

  return (
    <button 
      onClick={handleBack}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-100"
    >
      <ArrowLeft size={16} />
      Kembali ke Peta
    </button>
  )
}
