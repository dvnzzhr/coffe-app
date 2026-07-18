"use client"

import React, { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Navigation, ShieldCheck, Star, X, Maximize, Minimize, PanelLeftClose, PanelLeftOpen, Map as MapIcon, Loader2, Sparkles } from 'lucide-react'
import { fetchCafes } from '@/lib/foursquare'
import MapSidebar from './MapSidebar'
import SearchBar from './SearchBar'

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })

const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false })
const ZoomControl = dynamic(() => import('react-leaflet').then(m => m.ZoomControl), { ssr: false })

const ChangeView = dynamic(
  async () => {
    const { useMap } = await import('react-leaflet')

    return function ChangeView({ center }: { center: [number, number] }) {
      const map = useMap()
      map.flyTo(center, 15)
      return null
    }
  },
  { ssr: false }
)

interface MapComponentProps {
  dbCafes: any[]
  keywordMapping: Record<string, string>
}

export default function MapComponent({ dbCafes, keywordMapping }: MapComponentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const southSurabaya: [number, number] = [-7.3365, 112.7378]
  const [mapCenter, setMapCenter] = useState<[number, number]>(southSurabaya)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  // cafes = hanya hasil Foursquare (persis seperti map/page.tsx)
  const [cafes, setCafes] = useState<any[]>([])
  const [query, setQuery] = useState("")
  const [userIcon, setUserIcon] = useState<any>(null)
  const [cafeIcon, setCafeIcon] = useState<any>(null)
  const [dbIcon, setDbIcon] = useState<any>(null)
  const [bestMatchIcon, setBestMatchIcon] = useState<any>(null)
  const [searching, setSearching] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [searchMode, setSearchMode] = useState<'current' | 'surabaya'>('surabaya')
  const [activeCafeId, setActiveCafeId] = useState<string | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [areaCenter, setAreaCenter] = useState<[number, number] | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [detailLoadingHref, setDetailLoadingHref] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const isDetailMapPage = pathname === '/map'

  const getCafeDetailHref = (cafe: any) => {
    const id = cafe.id || (cafe.fsqPlaceId ? `fsq-${cafe.fsqPlaceId}` : null)
    return id ? `/cafes/${encodeURIComponent(String(id))}` : '#'
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

  const recordInteraction = (cafeId: number, type: 'click' | 'view' | 'route' | 'search') => {
    fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cafeId, type }),
    }).catch((error) => console.error('Interaction tracking failed:', error))
  }

  const openCafeDetail = (cafe: any) => {
    const href = getCafeDetailHref(cafe)
    if (href === '#') return

    if (cafe.id && typeof cafe.id === 'number') {
      recordInteraction(cafe.id, 'click')
    }

    setDetailLoadingHref(href)
    router.push(href)
  }

  useEffect(() => {
    setDetailLoadingHref(null)
  }, [pathname])

  useEffect(() => {
    import('leaflet').then(L => {
      setUserIcon(new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }))

      // Foursquare cafes: merah (sama persis map/page.tsx)
      setCafeIcon(new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }))

      // DB cafes: oranye (berbeda agar bisa dibedakan)
      setDbIcon(new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [30, 46],
        iconAnchor: [15, 46],
      }))

      // Best Match: hijau (untuk hasil paling relevan)
      setBestMatchIcon(new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [35, 51],
        iconAnchor: [17, 51],
      }))
    })
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const initialQ = params.get('q')
    const initialMode = params.get('mode') as 'current' | 'surabaya'

    if (initialMode) {
      setSearchMode(initialMode)
      if (initialMode === 'current' && !userLocation) detectLocation()
    } else {
      const cachedMode = localStorage.getItem('lastSearchMode') as 'current' | 'surabaya'
      if (cachedMode) {
        setSearchMode(cachedMode)
        if (cachedMode === 'current' && !userLocation) detectLocation()
      }
    }

    // Helper to load dbCafes as default
    const loadDefaultCafes = () => {
      const defaultCafes = dbCafes.map((c: any) => ({
        ...c,
        isDb: true,
        isFoursquare: false,
        latitude: parseFloat(c.latitude),
        longitude: parseFloat(c.longitude),
        distance: 0,
        relevance: 100, // Make default cafes high relevance
      }))
      setCafes(defaultCafes)
    }

    try {
      // Guard: clear oversized cache that could crash the page (>500KB)
      const cachedCafes = localStorage.getItem('lastSearchCafes')
      if (cachedCafes && cachedCafes.length > 500_000) {
        localStorage.removeItem('lastSearchCafes')
        localStorage.removeItem('lastSearchQuery')
      }

      const cachedQuery = localStorage.getItem('lastSearchQuery')
      const freshCafes = localStorage.getItem('lastSearchCafes')

      if (initialQ) {
        setQuery(initialQ)
        if (cachedQuery === initialQ && freshCafes) {
          setCafes(JSON.parse(freshCafes))
          return
        } else {
          handleSearch(initialQ)
          return
        }
      } else if (cachedQuery !== null && freshCafes) {
        setQuery(cachedQuery)
        setCafes(JSON.parse(freshCafes))
        
        if (cachedQuery) {
          params.set('q', cachedQuery)
        } else {
          params.delete('q')
        }
        
        const mode = initialMode || localStorage.getItem('lastSearchMode') || 'surabaya'
        params.set('mode', mode)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        return
      } else {
        const mode = initialMode || localStorage.getItem('lastSearchMode') || 'surabaya'
        const isDefaultLoaded = localStorage.getItem('isDefaultSurabayaLoaded') === 'true'
        if (mode === 'surabaya' && isDefaultLoaded) {
          loadDefaultCafes()
          return
        }
      }

      // Belum ada pencarian
      setCafes([])

    } catch (e) {
      // If localStorage is corrupt or inaccessible, clear it and move on
      try {
        localStorage.removeItem('lastSearchCafes')
        localStorage.removeItem('lastSearchQuery')
      } 
      catch { /* ignore */ }
      
      if (initialQ) {
        handleSearch(initialQ)
      } else {
        const isDefaultLoaded = localStorage.getItem('isDefaultSurabayaLoaded') === 'true'
        if (isDefaultLoaded) loadDefaultCafes()
        else setCafes([])
      }
    }
  }, [dbCafes]) // include dbCafes in deps so it updates when page fetches data

  const getCurrentLocationPromise = (): Promise<[number, number]> => {
    return new Promise((resolve) => {
      // Selalu ambil posisi terbaru, dan wajib pusatkan peta (setMapCenter)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setUserLocation([lat, lng])
          setMapCenter([lat, lng])
          resolve([lat, lng])
        },
        () => {
          // fallback to Wonokromo if permission denied
          const fallback: [number, number] = [-7.2915, 112.7348]
          if (!userLocation) setUserLocation(fallback)
          setMapCenter(userLocation || fallback)
          resolve(userLocation || fallback)
        },
        { enableHighAccuracy: true, timeout: 5000 }
      )
    })
  }

  const detectLocation = async () => {
    setIsDetectingLocation(true)
    try {
      return await getCurrentLocationPromise()
    } catch (e) {
      console.error(e)
      return null
    } finally {
      setIsDetectingLocation(false)
    }
  }

  // Persis logika map/page.tsx — hanya tambahan DB cafes di sidebar & peta
  const handleSearch = async (overrideQuery?: string, overrideMode?: 'current' | 'surabaya' | 'area', overrideCenter?: [number, number]) => {
    const activeQuery = typeof overrideQuery === 'string' ? overrideQuery : query
    const mapped = keywordMapping[activeQuery.toLowerCase()] || activeQuery || ""
    const currentMode = overrideMode || localStorage.getItem('lastSearchMode') || 'surabaya'

    let locToUse = userLocation
    if (!locToUse) {
      locToUse = await detectLocation() || null
    }

    // Update URL query parameters without full reload
    const params = new URLSearchParams(window.location.search)
    if (activeQuery) {
      params.set('q', activeQuery)
    } else {
      params.delete('q')
    }
    params.set('mode', currentMode)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    localStorage.setItem('lastSearchMode', currentMode)

    setSearching(true)
    setShowSuggestions(false)
    
    // Jika mode Surabaya & tidak ada pencarian kategori spesifik, cukup tampilkan default dari Database lokal
    // untuk mencegah ratusan Pin Foursquare acak menumpuk di map secara sia-sia.
    if (currentMode === 'surabaya' && !activeQuery) {
      const defaultCafes = dbCafes.map((c: any) => ({
        ...c,
        isDb: true,
        isFoursquare: false,
        latitude: parseFloat(c.latitude),
        longitude: parseFloat(c.longitude),
        distance: 0,
        relevance: 100,
      }))
      setCafes(defaultCafes)
      setMapCenter([-7.32, 112.74]) // titik tengah kasaran Surabaya Selatan
      setSearching(false)
      try {
        localStorage.setItem('lastSearchQuery', '')
        localStorage.setItem('isDefaultSurabayaLoaded', 'true')
        localStorage.removeItem('lastSearchCafes') // Bersihkan cache karena mengandalkan DB statis
      } catch (e) {}
      return
    }

    try {
      localStorage.removeItem('isDefaultSurabayaLoaded')
    } catch(e) {}
    
    let allResults: any[] = []

    let searchCenters = [
      [-7.2915, 112.7348], // Wonokromo
      [-7.3385, 112.7297], // Gayungan
      [-7.3244, 112.7139], // Wiyung
      [-7.3507, 112.7013], // Karang Pilang
      [-7.3082, 112.7704], // Tenggilis Mejoyo
      [-7.3581, 112.7812], // Gunung Anyar
      [-7.3167, 112.7425], // Jambangan
      [-7.2874, 112.7189], // Dukuh Pakis
      [-7.2752, 112.7284], // Sawahan
    ]

    // Jika mode pencarian adalah current, tunggu geolocation jika belum ada
    if (currentMode === 'current') {
      if (locToUse) {
        searchCenters = [locToUse]
      } else {
        const loc = await getCurrentLocationPromise()
        searchCenters = [loc]
      }
    }

    const fetchPromises = searchCenters.map(center => fetchCafes(mapped, center[0], center[1], activeQuery))
    const resultsArrays = await Promise.all(fetchPromises)

    resultsArrays.forEach(data => {
      allResults.push(...(data.results || []))
    })

    // Deduplicate by DB id (no more FSQ duplication since we upsert)
    const unique = Array.from(
      new Map(allResults.map((item: any) => [item.id, item])).values()
    ) as any[]

    // Sort by relevance then distance
    const normalized = unique
      .map((item: any) => {
        // Calculate word-based relevance score
        const name = (item.name || item.cafeName || '').toLowerCase()
        const q = mapped.toLowerCase()
        const queryWords = q.split(/\s+/).filter(w => w.length > 0)

        let relevance = 0
        if (name === q) {
          relevance = 100
        } else if (name.startsWith(q)) {
          relevance = 90
        } else {
          // Count how many query words match
          let matches = 0
          queryWords.forEach(word => {
            if (name.includes(word)) matches++
          })

          if (matches > 0) {
            // Score based on percentage of words matched
            relevance = (matches / queryWords.length) * 80
          }
        }

        return {
          ...item,
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
          relevance
        }
      })
      .filter((item: any) => !isNaN(item.latitude) && !isNaN(item.longitude))
      .sort((a: any, b: any) => {
        // First sort by relevance (descending)
        if (Math.abs(b.relevance - a.relevance) > 0.1) {
          return b.relevance - a.relevance
        }
        // Prioritize fresh Foursquare API results, owner data is supplemental
        const aIsFoursquare = a.source === 'foursquare' || a.isFoursquare
        const bIsFoursquare = b.source === 'foursquare' || b.isFoursquare
        if (aIsFoursquare !== bIsFoursquare) {
          return aIsFoursquare ? -1 : 1
        }
        // Then by distance (ascending)
        if (a.distance === 0) return 1
        if (b.distance === 0) return -1
        return a.distance - b.distance
      })
      .map((item, index) => ({
        ...item,
        isBestMatch: index === 0 && item.relevance > 0 // Only mark as best match if it has some relevance
      }))

    try {
      // Limit to top 50 results to avoid localStorage QuotaExceededError
      const toCache = normalized.slice(0, 50)
      localStorage.setItem('lastSearchQuery', activeQuery)
      localStorage.setItem('lastSearchCafes', JSON.stringify(toCache))
    } catch (e) {
      // If quota is still exceeded, clear stale cache and try again with fewer items
      try {
        localStorage.removeItem('lastSearchCafes')
        localStorage.removeItem('lastSearchQuery')
        const toCache = normalized.slice(0, 20)
        localStorage.setItem('lastSearchQuery', activeQuery)
        localStorage.setItem('lastSearchCafes', JSON.stringify(toCache))
      } catch {
        // If still failing, just skip caching — don't crash the page
        console.warn('localStorage quota exceeded, search results will not be cached.')
      }
    }

    setCafes(normalized)
    setSearching(false)

    // Highlight the top result
    const first = normalized[0]
    if (first) {
      setMapCenter([first.latitude, first.longitude])
    }
  }

  // Helper untuk hitung jarak (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3 // metres
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return Math.round(R * c) // dalam meter
  }

  // Filter out invalid coordinates from search results
  const allCafes = cafes
    .filter(c => !isNaN(c.latitude) && !isNaN(c.longitude))
    .sort((a, b) => {
      if (a.distance === 0) return 1
      if (b.distance === 0) return -1
      return a.distance - b.distance
    })

  const keywordOptions = Object.keys(keywordMapping).slice(0, 8) // Ambil 8 pertama untuk filter cepat

  // Filter suggestions based on typed query
  const allKeywords = Object.keys(keywordMapping)
  const filteredSuggestions = query.length > 0
    ? allKeywords.filter(k => k.toLowerCase().includes(query.toLowerCase()))
    : allKeywords

  return (
    <div className={`transition-all duration-500 bg-slate-100 flex flex-col ${isFullscreen
      ? 'fixed top-20 inset-x-0 bottom-0 z-[1500] p-0'
      : 'h-full w-full rounded-3xl overflow-hidden'
      }`}>

      <div className={`flex-1 flex flex-col lg:flex-row overflow-hidden ${isFullscreen ? '' : 'p-3 lg:p-4 gap-4'}`}>

        
        {/* Sidebar */}
        <MapSidebar
          showSidebar={showSidebar}
          isFullscreen={isFullscreen}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
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
          keywordOptions={keywordOptions}
          allCafes={allCafes}
          setMapCenter={setMapCenter}
          openCafeDetail={openCafeDetail}
          detailLoadingHref={detailLoadingHref}
          activeCafeId={activeCafeId}
        />

        {/* Map Area */}

        <div className={`flex-1 relative transition-all duration-500 overflow-hidden ${isFullscreen ? '' : 'rounded-3xl shadow-xl'}`}>
          {detailLoadingHref && (
            <div className="absolute inset-0 z-[1200] flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px]">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/40 bg-white/95 px-5 py-3 text-sm font-bold text-slate-700 shadow-2xl">
                <Loader2 size={18} className="animate-spin text-blue-600" />
                Membuka detail cafe...
              </div>
            </div>
          )}

          {/* Floating Controls */}
          <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-2xl shadow-xl hover:bg-white transition-all text-slate-700 flex items-center justify-center"
              title={showSidebar ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
            >
              {showSidebar ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
          </div>

          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            {!isDetailMapPage && (
              <Link
                href="/map"
                className="bg-blue-600/95 backdrop-blur-md border border-blue-500 px-4 py-3 rounded-2xl shadow-xl hover:bg-blue-700 transition-all text-white flex items-center justify-center gap-2 text-sm font-bold"
                title="Buka Detail Map"
              >
                <MapIcon size={18} />
                <span className="hidden sm:inline">Detail Map</span>
              </Link>
            )}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-2xl shadow-xl hover:bg-white transition-all text-slate-700 flex items-center justify-center"
              title={isFullscreen ? "Keluar Tampilan Penuh" : "Tampilan Penuh"}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>

          {!showSidebar && (
            <div className="absolute top-4 left-16 z-[1000] right-16 lg:right-auto lg:w-96">
              <SearchBar 
                isFloating={true}
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
            </div>
          )}

          {locationError && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[2000] bg-yellow-50 text-yellow-700 px-4 py-3 rounded-xl shadow-lg border border-yellow-200 text-xs font-bold animate-pulse text-center">
              {locationError}
            </div>
          )}
          <div className="h-full w-full">
            <MapContainer center={mapCenter} zoom={13} zoomControl={false} style={{ height: '100%', width: '100%' }}>
              <ZoomControl position="bottomleft" />
              <TileLayer
                attribution="OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <ChangeView center={mapCenter} />

              {userIcon && userLocation && (
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>Lokasi Anda</Popup>
                </Marker>
              )}

              {/* Unified Cafe Markers */}
              {allCafes.map((cafe) => {
                let icon = cafe.source === 'foursquare' ? cafeIcon : dbIcon;
                if (cafe.isBestMatch && bestMatchIcon) icon = bestMatchIcon;
                if (!icon) return null;

                return (
                  <Marker
                    key={`marker-${cafe.id || cafe.fsqPlaceId}`}
                    position={[cafe.latitude, cafe.longitude]}
                    icon={icon}
                    eventHandlers={{
                      click: () => {
                        openCafeDetail(cafe)
                      }
                    }}
                  >
                    <Popup>{cafe.cafeName || cafe.name}</Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

        </div>
      </div>
    </div>
  )
}
