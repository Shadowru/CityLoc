import { writable } from 'svelte/store'

export type AppState =
  | 'boot'
  | 'qr-resolved'
  | 'camera-request'
  | 'camera-ready'
  | 'tracking'
  | 'localizing'
  | 'localized'
  | 'low-confidence'
  | 'historical-mode'
  | 'error'

export const appState = writable<AppState>('boot')

// Helper functions for state transitions
export const transitionTo = (state: AppState) => {
  appState.set(state)
}

// Reset to initial state
export const resetApp = () => {
  appState.set('boot')
}