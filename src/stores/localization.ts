import { writable } from 'svelte/store'
import type { LocalizationResult } from './session'

export interface LocalizationProgress {
  status: 'idle' | 'sampling' | 'uploading' | 'processing' | 'success' | 'error'
  progress: number // 0-1
  lastResult: LocalizationResult | null
  lastError: string | null
}

export const localizationProgress = writable<LocalizationProgress>({
  status: 'idle',
  progress: 0,
  lastResult: null,
  lastError: null,
})

// Start localization process
export function startLocalization() {
  localizationProgress.set({
    status: 'sampling',
    progress: 0.1,
    lastResult: null,
    lastError: null,
  })
}

// Update progress
export function updateLocalizationProgress(status: LocalizationProgress['status'], progress: number) {
  localizationProgress.update(state => ({
    ...state,
    status,
    progress,
  }))
}

// Set result
export function setLocalizationResult(result: LocalizationResult) {
  localizationProgress.set({
    status: 'success',
    progress: 1,
    lastResult: result,
    lastError: null,
  })
}

// Set error
export function setLocalizationError(error: string) {
  localizationProgress.update(state => ({
    ...state,
    status: 'error',
    lastError: error,
  }))
}

// Reset
export function resetLocalization() {
  localizationProgress.set({
    status: 'idle',
    progress: 0,
    lastResult: null,
    lastError: null,
  })
}