"use client"
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Custom Map Pin Style Configuration
const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-pink.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

function MapEventsHandler({ onChange, markerPosition }: { 
  onChange: (lat: number, lng: number) => void,
  markerPosition: [number, number] | null 
}) {
  const map = useMap()
  
  // Update Pin Location when User Clicks anywhere on the map
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng)
    },
  })

  // Smoothly Fly Map to the typed Coordinate when it receives new props
  useEffect(() => {
    if (markerPosition) {
      map.flyTo(markerPosition, map.getZoom(), { animate: true, duration: 2.0 })
    }
  }, [markerPosition, map])

  return null
}

interface LocationPickerProps {
  latitude: string
  longitude: string
  onChange: (lat: string, lng: string) => void
}

export default function LocationPickerMap({ latitude, longitude, onChange }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false)
  
  // Default to Surabaya region if the input is empty or invalid
  const defaultPosition: [number, number] = [-7.289166, 112.734398] 

  // Parse coords
  const parsedLat = parseFloat(latitude)
  const parsedLng = parseFloat(longitude)
  const hasValidPosition = !isNaN(parsedLat) && !isNaN(parsedLng)
  
  const centerPosition: [number, number] = hasValidPosition ? [parsedLat, parsedLng] : defaultPosition

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-80 bg-slate-50 flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200">
        <span className="text-slate-400 font-bold loading-pulse">Memuat Peta Spasial...</span>
      </div>
    )
  }

  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative z-10 group">
      <div className="absolute top-2 right-2 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-pink-600 shadow-sm border border-pink-100 flex items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        Geser & Klik untuk pindah Pin
      </div>
      <MapContainer 
        center={centerPosition} 
        zoom={14} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hasValidPosition && (
          <Marker position={centerPosition} icon={defaultIcon} />
        )}
        <MapEventsHandler 
          onChange={(lat, lng) => onChange(lat.toFixed(6), lng.toFixed(6))} 
          markerPosition={hasValidPosition ? centerPosition : null} 
        />
      </MapContainer>
    </div>
  )
}
