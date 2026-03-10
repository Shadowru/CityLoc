import type {
  QREntryResponse,
  LocalizationRequest,
  LocalizationResponse,
  ContentItem,
  HistoricalLayerDescriptor,
  ApiError
} from './types'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      code: 'unknown',
      message: `HTTP ${response.status}: ${response.statusText}`,
    }))
    throw new Error(`API error: ${error.message}`)
  }

  return response.json() as Promise<T>
}

// QR resolution
export async function resolveQR(qrId: string): Promise<QREntryResponse> {
  // For now, mock response
  console.log('Resolving QR:', qrId)
  return Promise.resolve({
    qrId,
    locationId: 'loc_center_square',
    routeId: 'route_old_town',
    startingPoseHint: {
      lat: 52.520008,
      lng: 13.404954,
      heading: 0,
    },
  })
}

// Localization
export async function localize(request: LocalizationRequest): Promise<LocalizationResponse> {
  console.log('Localizing with request:', request)
  // Mock response with simulated delay
  await new Promise(resolve => setTimeout(resolve, 800))
  return {
    sceneId: 'scene_city_hall',
    buildingId: 'bld_city_hall',
    confidence: 0.92,
    pose: {
      position: [0, 0, 0],
      rotation: [0, 0, 0, 1],
    },
    contentIds: ['fact_1', 'fact_2'],
    timelineAvailable: [0, 50, 100, 150],
  }
}

// Fetch content items
export async function fetchContent(contentIds: string[]): Promise<ContentItem[]> {
  console.log('Fetching content:', contentIds)
  // Mock response
  return Promise.resolve([
    {
      id: 'fact_1',
      type: 'fact',
      title: 'City Hall History',
      text: 'This building was constructed in 1910 and served as the main administrative center.',
      position: [1, 2, 0],
    },
    {
      id: 'fact_2',
      type: 'narration',
      title: 'Architectural Style',
      text: 'The architecture represents neo-Gothic influences with modern adaptations.',
      audioUrl: '/audio/narration1.mp3',
    },
  ])
}

// Fetch historical layer
export async function fetchHistoricalLayer(
  sceneId: string,
  yearOffset: number
): Promise<HistoricalLayerDescriptor> {
  console.log('Fetching historical layer:', sceneId, yearOffset)
  // Mock response
  return {
    sceneId,
    yearOffset,
    assets: {
      overlayModelUrl: `/assets/history/${sceneId}_${yearOffset}.glb`,
      textureSetUrl: `/assets/history/${sceneId}_${yearOffset}/`,
    },
  }
}