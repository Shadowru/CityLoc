// AR-related types

export interface ARPose {
  position: [number, number, number]
  rotation: [number, number, number, number] // quaternion
}

export interface ARCamera {
  pose: ARPose
  intrinsics?: {
    focalLength: [number, number]
    principalPoint: [number, number]
  }
}

export interface ARFrame {
  timestamp: number
  camera: ARCamera
  imageData?: ImageData // optional, for localization sampling
}

export interface ARTrackingState {
  isTracking: boolean
  confidence: number
  pose: ARPose | null
}

export type ARTrackingCallback = (frame: ARFrame) => void
export type ARStateCallback = (state: ARTrackingState) => void