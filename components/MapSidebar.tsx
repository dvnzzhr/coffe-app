"use client"

import React from 'react'
import { ShieldCheck, Star, Sparkles, Loader2 } from 'lucide-react'
import SearchBar from './SearchBar'

interface MapSidebarProps {
  showSidebar: boolean
  isFullscreen: boolean
  searchMode: 'surabaya' | 'current'
  setSearchMode: (mode: 'surabaya' | 'current') => void
  query: string
  setQuery: (val: string) => void
  handleSearch: () => void
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
  detailLoadingHref
}: MapSidebarProps) {
  return (
    <div className={`transition-all duration-500 ease-in-out bg-white shadow-xl flex flex-col overflow-hidden relative z-[1000] ${showSidebar
      ? 'lg:w-[400px] h-[55vh] lg:h-full opacity-100'
      : 'w-0 h-0 lg:h-full lg:w-0 opacity-0 pointer-events-none'
      } ${isFullscreen ? 'lg:rounded-none' : 'rounded-3xl'}`}>

      <div className="p-3 lg:p-4 flex flex-col h-full min-w-[320px]">
        <h1 className="text-lg lg:text-xl font-bold text-slate-700 mb-2 lg:mb-4">
          Café Recommendation ☕
        </h1>

        <div className="mb-4">
          <div className="bg-slate-50 p-1 rounded-2xl flex gap-1 mb-3 border border-slate-100">
            <button
              onClick={() => {
                setSearchMode('surabaya')
              }}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${searchMode === 'surabaya'
                ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              Surabaya Selatan
            </button>
            <button
              onClick={() => {
                setSearchMode('current')
              }}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${searchMode === 'current'
                ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
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
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {item}
              </button>
            ))}
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
          {allCafes.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {allCafes.map((cafe) => {
                const imageUrl = getCafeImage(cafe)
                const href = cafe.id || cafe.fsqPlaceId ? `/cafes/${encodeURIComponent(String(cafe.id || cafe.fsqPlaceId))}` : '#'
                const rating = getCafeRating(cafe)
                const ambiance = getCafeAmbiance(cafe)
                const isOpeningDetail = detailLoadingHref === href

                return (
                  <article
                    key={`sidebar-${cafe.id || cafe.fsqPlaceId}`}
                    onMouseEnter={() => {
                      if (!isNaN(cafe.latitude) && !isNaN(cafe.longitude)) {
                        setMapCenter([cafe.latitude, cafe.longitude])
                      }
                    }}
                    className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${cafe.isBestMatch ? 'border-green-200 ring-1 ring-green-100' : 'border-slate-100'
                      }`}
                  >
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className={`h-full w-full flex items-center justify-center text-3xl ${cafe.source === 'foursquare' ? 'bg-blue-100 text-blue-500' : 'bg-orange-100 text-orange-500'}`}>
                          ☕
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
                        {cafe.isDb && <ShieldCheck size={12} className="mt-0.5 shrink-0 text-blue-500" />}
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
                        <span className={`min-w-0 flex-1 truncate rounded-full px-2 py-1 text-[9px] font-bold ${cafe.source === 'foursquare' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
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
                        className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:bg-blue-400"
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
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                🔍
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
