"use client"

import { useState, useEffect } from "react"
import { Coffee } from "lucide-react"
import MapComponent from "@/components/MapComponent"

export default function FullMapPage() {
  const [dbCafes, setDbCafes] = useState<any[]>([])
  const [keywordMapping, setKeywordMapping] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public-map-data')
      .then((res) => res.json())
      .then((data) => {
        setDbCafes(data.cafes || [])
        setKeywordMapping(data.keywordMapping || {})
      })
      .catch((error) => console.error('Map data fetch error:', error))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center">
        <div className="animate-spin text-pink-600 mb-4">
          <Coffee size={48} />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Menyiapkan Peta Penuh SIG...</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col overflow-hidden">
      {/* Removed overlapping back button overlay, moved to MapSidebar */}

      <div className="flex-1 w-full h-full">
        <MapComponent dbCafes={dbCafes} keywordMapping={keywordMapping} />
      </div>
    </div>
  )
}
