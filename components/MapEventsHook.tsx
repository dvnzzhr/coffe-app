"use client"

import { useMapEvents } from 'react-leaflet'

export default function MapEventsHook({ onMoveEnd }: { onMoveEnd: (lat: number, lng: number) => void }) {
  useMapEvents({
    dragend: (e) => {
      const center = e.target.getCenter()
      onMoveEnd(center.lat, center.lng)
    },
    zoomend: (e) => {
      const center = e.target.getCenter()
      onMoveEnd(center.lat, center.lng)
    }
  })
  return null
}
