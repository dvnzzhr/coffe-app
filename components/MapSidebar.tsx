"use client"

import React from 'react'
import { ShieldCheck, Star, Sparkles, Loader2, Wifi, Wind, Coffee, Search } from 'lucide-react'
import SearchBar from './SearchBar'

interface MapSidebarProps {
  showSidebar: boolean
  isFullscreen: boolean
  searchMode: 'surabaya' | 'current'
  setSearchMode: (mode: 'surabaya' | 'current') => void
  query: string
  setQuery: (val: string) => void
  handleSearch: (overrideQuery?: string, overrideMode?: 'current' | 'surabaya' | 'area', overrideCenter?: [number, number]) => void
  showSuggestions: boolean
  setShowSuggestions: (val: boolean) => void
  filteredSuggestions: string[]
  keywordMapping: Record<string, string>
  isDetectingLocation: boolean
  detectLocation: () => void
  searching: boolean
  keywordOptions: string[]
  allCafes: any[]
  setMapCenter: (center: [number, number]) => void
  openCafeDetail: (cafe: any) => void
  detailLoadingHref: string | null
  activeCafeId: string | null
}

const getCafeImage = (cafe: any) => cafe.images?.[0]?.url || ''

const getCafeAmbiance = (cafe: any) =>
  typeof cafe.ambiance === 'string' && cafe.ambiance.trim()
    ? cafe.ambiance.trim()
    : null

const getCafeSummary = (cafe: any) =>
  cafe.description || cafe.facilities || cafe.categories?.[0]?.name || cafe.categories?.[0]?.short_name || 'Cafe'

const getCafeRating = (cafe: any) =>
  typeof cafe.rating === 'number' && !Number.isNaN(cafe.rating)
    ? cafe.rating.toFixed(1)
    : null

export default function MapSidebar({
  showSidebar,
  isFullscreen,
  searchMode,
  setSearchMode,
  query,
  setQuery,
  handleSearch,
  showSuggestions,
  setShowSuggestions,
  filteredSuggestions,
  keywordMapping,
  isDetectingLocation,
  detectLocation,
  searching,
  keywordOptions,
  allCafes,
  setMapCenter,
  openCafeDetail,
  detailLoadingHref,
  activeCafeId
}: MapSidebarProps) {
  const [filterRating, setFilterRating] = React.useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('mapFilterRating') === 'true'
    return false
  })
  const [filterWiFi, setFilterWiFi] = React.useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('mapFilterWiFi') === 'true'
    return false
  })
  const [filterOutdoor, setFilterOutdoor] = React.useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('mapFilterOutdoor') === 'true'
    return false
  })

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
       sessionStorage.setItem('mapFilterRating', String(filterRating))
       sessionStorage.setItem('mapFilterWiFi', String(filterWiFi))
       sessionStorage.setItem('mapFilterOutdoor', String(filterOutdoor))
    }
  }, [filterRating, filterWiFi, filterOutdoor])

  const finalCafes = React.useMemo(() => {
    return allCafes.filter(cafe => {
      if (filterRating && (cafe.rating || 0) < 4.0) return false;
      const fac = String(cafe.facilities || "").toLowerCase();
      const desc = String(cafe.description || "").toLowerCase();
      if (filterWiFi && !fac.includes('wifi') && !desc.includes('wifi')) return false;
      if (filterOutdoor && !fac.includes('outdoor') && !fac.includes('smoking') && !desc.includes('outdoor')) return false;
      return true;
    })
  }, [allCafes, filterRating, filterWiFi, filterOutdoor])

  React.useEffect(() => {
    if (activeCafeId) {
      const el = document.getElementById(`cafe-card-${activeCafeId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [activeCafeId])

  return (
    <div className={`transition-all duration-500 ease-in-out bg-white shadow-xl flex flex-col overflow-hidden relative z-[1000] ${showSidebar
      ? 'lg:w-[400px] h-[55vh] lg:h-full opacity-100'
      : 'w-0 h-0 lg:h-full lg:w-0 opacity-0 pointer-events-none'
      } ${isFullscreen ? 'lg:rounded-none' : 'rounded-3xl'}`}>

      <div className="p-3 lg:p-4 flex flex-col h-full min-w-[320px]">
        {isFullscreen && (
          <div className="mb-4">
            <a 
              href="/"
              className="inline-flex bg-white border border-slate-200 pl-3 pr-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-all text-slate-700 items-center justify-start gap-2 font-bold text-xs"
            >
              <div className="bg-slate-100 p-1 rounded-md">
                <Search size={14} className="text-slate-500" />
              </div>
              Kembali ke Beranda
            </a>
          </div>
        )}
        <h1 className="text-lg lg:text-xl font-bold text-slate-700 mb-2 lg:mb-4">
          Café Recommendation
        </h1>

        <div className="mb-4">
          <div className="bg-slate-50 p-1 rounded-2xl flex gap-1 mb-3 border border-slate-100">
            <button
              onClick={() => {
                setSearchMode('surabaya')
                handleSearch(query, 'surabaya')
              }}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${searchMode === 'surabaya'
                ? 'bg-white text-pink-600 shadow-sm border border-pink-100'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              Surabaya Selatan
            </button>
            <button
              onClick={() => {
                setSearchMode('current')
                handleSearch(query, 'current')
              }}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${searchMode === 'current'
                ? 'bg-white text-pink-600 shadow-sm border border-pink-100'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              Lokasi Terdekat
            </button>
          </div>

          <SearchBar 
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            filteredSuggestions={filteredSuggestions}
            keywordMapping={keywordMapping}
            isDetectingLocation={isDetectingLocation}
            detectLocation={detectLocation}
            searching={searching}
          />

          <div className="flex flex-wrap gap-2">
            {keywordOptions.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item)
                  setShowSuggestions(false)
                }}
                className={`px-3 py-2 rounded-full text-sm transition-all ${query === item
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setFilterRating(!filterRating)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${filterRating ? 'bg-yellow-100 border-yellow-200 text-yellow-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <Star size={12} fill="currentColor" /> Rating 4.0+
            </button>
            <button
              onClick={() => setFilterWiFi(!filterWiFi)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${filterWiFi ? 'bg-pink-100 border-pink-200 text-pink-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <Wifi size={12} /> Free WiFi
            </button>
            <button
              onClick={() => setFilterOutdoor(!filterOutdoor)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${filterOutdoor ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <Wind size={12} /> Outdoor
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-3 px-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span> Database
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span> Foursquare
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></span> Hasil Terbaik
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {searching ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-slate-200"></div>
                  <div className="p-2.5">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded-md w-full mb-1"></div>
                    <div className="h-3 bg-slate-200 rounded-md w-1/2 mb-3"></div>
                    <div className="h-6 bg-slate-200 rounded-xl w-full mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : finalCafes.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {finalCafes.map((cafe: any) => {
                const imageUrl = getCafeImage(cafe)
                const href = cafe.id || cafe.fsqPlaceId ? `/cafes/${encodeURIComponent(String(cafe.id || cafe.fsqPlaceId))}` : '#'
                const rating = getCafeRating(cafe)
                const ambiance = getCafeAmbiance(cafe)
                const isOpeningDetail = detailLoadingHref === href

                return (
                  <article
                    id={`cafe-card-${cafe.id || cafe.fsqPlaceId}`}
                    key={`sidebar-${cafe.id || cafe.fsqPlaceId}`}
                    onMouseEnter={() => {
                      if (!isNaN(cafe.latitude) && !isNaN(cafe.longitude)) {
                        setMapCenter([cafe.latitude, cafe.longitude])
                      }
                    }}
                    className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${activeCafeId === String(cafe.id || cafe.fsqPlaceId) ? 'border-pink-400 ring-2 ring-pink-100' : cafe.isBestMatch ? 'border-green-200 ring-1 ring-green-100' : 'border-slate-100'
                      }`}
                  >
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className={`h-full w-full flex items-center justify-center text-3xl ${cafe.source === 'foursquare' ? 'bg-pink-100 text-pink-500' : 'bg-orange-100 text-orange-500'}`}>
                          <Coffee size={32} />
                        </div>
                      )}
                      {cafe.isBestMatch && (
                        <span className="absolute left-2 top-2 rounded-full bg-green-600 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white">
                          Terbaik
                        </span>
                      )}
                      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[9px] font-black text-slate-700 shadow-sm">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                        {rating || '-'}
                      </span>
                    </div>

                    <div className="p-2.5">
                      <div className="flex items-start gap-1.5">
                        <h2 className="min-w-0 flex-1 text-xs font-bold leading-snug text-slate-700 line-clamp-2">
                          {cafe.name || cafe.cafeName}
                        </h2>
                        {cafe.isDb && <ShieldCheck size={12} className="mt-0.5 shrink-0 text-pink-500" />}
                      </div>

                      <p className="mt-1.5 text-[10px] leading-snug text-slate-500 line-clamp-2">
                        {getCafeSummary(cafe)}
                      </p>

                      {ambiance && (
                        <div className="mt-2 inline-flex max-w-full items-center gap-1 rounded-lg border border-pink-100 bg-pink-50 px-2 py-1 text-[9px] font-bold text-pink-700">
                          <Sparkles size={10} className="shrink-0" />
                          <span className="truncate">Suasana: {ambiance}</span>
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-2">
                        <span className={`min-w-0 flex-1 truncate rounded-full px-2 py-1 text-[9px] font-bold ${cafe.source === 'foursquare' ? 'bg-pink-50 text-pink-600' : 'bg-orange-50 text-orange-600'}`}>
                          {cafe.categories?.[0]?.short_name || cafe.categories?.[0]?.name || 'Cafe'}
                        </span>
                        <span className="shrink-0 text-[9px] font-semibold text-slate-400">
                          {cafe.distance > 0 ? `${cafe.distance} m` : '-'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          openCafeDetail(cafe)
                        }}
                        disabled={isOpeningDetail || href === '#'}
                        className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-pink-600 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white transition-colors hover:bg-pink-700 disabled:cursor-wait disabled:bg-pink-400"
                      >
                        {isOpeningDetail && <Loader2 size={12} className="animate-spin" />}
                        {isOpeningDetail ? 'Membuka...' : 'Lihat Detail'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search size={28} className="text-slate-400" />
              </div>
              <h3 className="font-medium text-slate-600">Tidak ada hasil</h3>
              <p className="text-xs text-slate-400 mt-1">Coba kata kunci lain atau kosongkan untuk melihat semua.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
