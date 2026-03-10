import { writable } from 'svelte/store'

export interface QREntry {
  qrId: string
  locationId: string
  routeId: string
  startingPoseHint?: {
    lat: number
    lng: number
    heading: number
  }
}

export interface LocalizationResult {
  sceneId: string
  buildingId: string
  confidence: number
  pose: {
    position: [number, number, number]
    rotation: [number, number, number, number] // quaternion
  }
  contentIds: string[]
  timelineAvailable: number[]
}

export interface HistoricalLayer {
  sceneId: string
  yearOffset: number
  assets: {
    overlayModelUrl?: string
    textureSetUrl?: string
  }
}

// Session store
export const qrEntry = writable<QREntry | null>(null)
export const localization = writable<LocalizationResult | null>(null)
export const currentTimelineOffset = writable<number>(0) // 0 = present
export const historicalLayers = writable<HistoricalLayer[]>([])

// Reset session
export const resetSession = () => {
  qrEntry.set(null)
  localization.set(null)
  currentTimelineOffset.set(0)
  historicalLayers.set([])
}