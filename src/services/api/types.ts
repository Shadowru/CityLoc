// API types matching the data model in AGENTS.md

export interface QREntryResponse {
  qrId: string
  locationId: string
  routeId: string
  startingPoseHint?: {
    lat: number
    lng: number
    heading: number
  }
}

export interface LocalizationRequest {
  qrId: string
  imageData?: string // base64 encoded, downscaled image
  timestamp: number
  poseHint?: {
    position: [number, number, number]
    rotation: [number, number, number, number]
  }
}

export interface LocalizationResponse {
  sceneId: string
  buildingId: string
  confidence: number
  pose: {
    position: [number, number, number]
    rotation: [number, number, number, number]
  }
  contentIds: string[]
  timelineAvailable: number[]
}

export interface ContentItem {
  id: string
  type: 'fact' | 'narration' | 'overlay'
  title?: string
  text?: string
  audioUrl?: string
  position?: [number, number, number]
  rotation?: [number, number, number, number]
  scale?: [number, number, number]
}

export interface HistoricalLayerDescriptor {
  sceneId: string
  yearOffset: number
  assets: {
    overlayModelUrl?: string
    textureSetUrl?: string
  }
}

// Error response
export interface ApiError {
  code: string
  message: string
  details?: unknown
}