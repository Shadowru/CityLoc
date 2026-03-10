<script lang="ts">
  import { onMount } from 'svelte'
  import { appState } from '$stores/appState'
  import { resolveQR } from '$services/api/client'
  import { qrEntry } from '$stores/session'

  // State components
  import Boot from '$features/qr-entry/boot.svelte'
  import QRResolver from '$features/qr-entry/qr-resolver.svelte'
  import CameraRequest from '$features/qr-entry/camera-request.svelte'
  import CameraReady from '$features/qr-entry/camera-ready.svelte'
  import Tracking from '$features/localization/tracking.svelte'
  import Localizing from '$features/localization/localizing.svelte'
  import Localized from '$features/localization/localized.svelte'
  import LowConfidence from '$features/localization/low-confidence.svelte'
  import HistoricalMode from '$features/timeline/historical-mode.svelte'
  import ErrorState from '$features/qr-entry/error.svelte'

  let currentState = $appState

  // Parse QR ID from URL on mount
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const qrId = urlParams.get('qrId') || 'demo_qr_001'

    if (qrId) {
      // Transition to QR resolution
      appState.set('qr-resolved')
      
      // Resolve QR
      resolveQR(qrId)
        .then(entry => {
          qrEntry.set(entry)
          // Move to camera request
          appState.set('camera-request')
        })
        .catch(error => {
          console.error('Failed to resolve QR:', error)
          appState.set('error')
        })
    } else {
      // No QR ID - demo mode
      appState.set('camera-request')
    }
  })
</script>

<main class="app">
  {#if currentState === 'boot'}
    <Boot />
  {:else if currentState === 'qr-resolved'}
    <QRResolver />
  {:else if currentState === 'camera-request'}
    <CameraRequest />
  {:else if currentState === 'camera-ready'}
    <CameraReady />
  {:else if currentState === 'tracking'}
    <Tracking />
  {:else if currentState === 'localizing'}
    <Localizing />
  {:else if currentState === 'localized'}
    <Localized />
  {:else if currentState === 'low-confidence'}
    <LowConfidence />
  {:else if currentState === 'historical-mode'}
    <HistoricalMode />
  {:else if currentState === 'error'}
    <ErrorState />
  {/if}
</main>

<style>
  .app {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: system-ui, -apple-system, sans-serif;
  }
</style>