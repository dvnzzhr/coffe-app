"use client"

import React, { useRef, useEffect } from 'react'
import { Search, Navigation, Loader2, X } from 'lucide-react'

interface SearchBarProps {
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
  isFloating?: boolean
}

export default function SearchBar({
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
  isFloating = false
}: SearchBarProps) {
  const searchRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setShowSuggestions])

  if (isFloating) {
    return (
      <div ref={searchRef} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSearch()
                }
              }}
              placeholder="Cari keyword..."
              className="w-full pl-9 pr-8 py-3 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-md text-sm text-slate-700 shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500/40 transition-all"
            />
            {query && (
              <button
                onClick={() => { 
                  setQuery('')
                  setShowSuggestions(false)
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => handleSearch()}
            className="bg-pink-600 text-white p-3 rounded-2xl shadow-xl hover:bg-pink-700 transition-all"
            disabled={searching}
          >
            {searching ? <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search size={18} />}
          </button>
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl max-h-48 overflow-y-auto">
            {filteredSuggestions.map((keyword) => (
              <button
                key={keyword}
                onClick={() => {
                  setQuery(keyword)
                  setShowSuggestions(false)
                }}
                className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center gap-2"
              >
                <Search size={13} className="text-slate-400" />
                <span>{keyword}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={searchRef} className="relative mb-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSearch()
              }
            }}
            placeholder="Cari keyword (misal: estetik, murah...)"
            className="w-full pl-9 pr-8 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-400 transition-all"
          />
          {query && (
            <button
              onClick={() => { 
                setQuery('')
                setShowSuggestions(false)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={detectLocation}
          disabled={isDetectingLocation || searching}
          className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-400 text-white p-3 rounded-xl shrink-0 transition-colors flex items-center justify-center"
          title="Deteksi Lokasi Saya"
        >
          {isDetectingLocation ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Navigation size={18} />
          )}
        </button>

        <button
          onClick={() => handleSearch()}
          disabled={searching}
          className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white px-4 rounded-xl flex items-center gap-2 shrink-0 transition-colors"
        >
          {searching ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Search size={18} />
          )}
          {searching ? 'Mencari...' : 'Cari'}
        </button>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg max-h-48 overflow-y-auto">
          {filteredSuggestions.map((keyword) => (
            <button
              key={keyword}
              onClick={() => {
                setQuery(keyword)
                setShowSuggestions(false)
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center gap-2 first:rounded-t-xl last:rounded-b-xl"
            >
              <Search size={13} className="text-slate-400 shrink-0" />
              <span>{keyword}</span>
              <span className="ml-auto text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{keywordMapping[keyword]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
