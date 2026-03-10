<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { appState } from '$stores/appState'
  import { qrEntry, localization, currentTimelineOffset } from '$stores/session'
  import { localizationProgress, startLocalization, setLocalizationResult } from '$stores/localization'
  import { eighthWallService } from '$services/ar/eighthWall'
  import { localize } from '$services/api/client'
  import type { ARFrame } from '$services/ar/types'
  
  let videoPlaceholder = true
  let trackingStatus = 'Initializing...'
  let frameCount = 0
  let localizationAttempts = 0
  
  let progress = $localizationProgress
  let qr = $qrEntry
  let loc = $localization
  
  // AR tracking callback
  const handleARFrame = (frame: ARFrame) => {
    frameCount++
    
    // Update tracking status
    trackingStatus = `Tracking: ${frameCount} frames`
    
    // Sample frame for localization every 30 frames (simulated)
    if (frameCount % 30 === 0 && progress.status !== 'sampling' && progress.status !== 'uploading' && progress.status !== 'processing') {
      attemptLocalization(frame)
    }
  }
  
  // AR state callback
  const handleARState = (state: any) => {
    // Update UI based on AR tracking state
    if (!state.isTracking) {
      trackingStatus = 'Tracking lost - move your device'
    }
  }
  
  async function attemptLocalization(frame: ARFrame) {
    if (localizationAttempts >= 3) return // Limit attempts
    
    localizationAttempts++
    startLocalization()
    
    try {
      // Simulate sampling
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Update to uploading
      localizationProgress.update(state => ({ ...state, status: 'uploading', progress: 0.3 }))
      
      // Call localization API
      const qrId = qr?.qrId || 'demo_qr_001'
      const result = await localize({
        qrId,
        timestamp: frame.timestamp,
        poseHint: frame.camera.pose,
      })
      
      // Update to processing
      localizationProgress.update(state => ({ ...state, status: 'processing', progress: 0.7 }))
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Set result
      setLocalizationResult(result)
      localization.set(result)
      
      // Transition to localized state if confidence is high enough
      if (result.confidence > 0.7) {
        setTimeout(() => {
          appState.set('localized')
        }, 1000)
      } else {
        appState.set('low-confidence')
      }
      
    } catch (error) {
      console.error('Localization failed:', error)
      localizationProgress.update(state => ({
        ...state,
        status: 'error',
        lastError: error instanceof Error ? error.message : 'Localization failed',
      }))
    }
  }
  
  onMount(() => {
    // Setup AR callbacks
    eighthWallService.addTrackingCallback(handleARFrame)
    eighthWallService.addStateCallback(handleARState)
    
    // Start tracking
    eighthWallService.startTracking().catch(console.error)
    
    // Start first localization attempt after a delay
    setTimeout(() => {
      if (progress.status === 'idle') {
        // Simulate a frame for first attempt
        attemptLocalization({
          timestamp: Date.now(),
          camera: {
            pose: {
              position: [0, 0, 0],
              rotation: [0, 0, 0, 1],
            },
          },
        })
      }
    }, 2000)
  })
  
  onDestroy(() => {
    // Cleanup
    eighthWallService.removeTrackingCallback(handleARFrame)
    eighthWallService.removeStateCallback(handleARState)
  })
  
  function skipToDemo() {
    // Set mock localization and go to localized state
    const mockResult = {
      sceneId: 'scene_city_hall',
      buildingId: 'bld_city_hall',
      confidence: 0.92,
      pose: {
        position: [0, 0, 0] as [number, number, number],
        rotation: [0, 0, 0, 1] as [number, number, number, number],
      },
      contentIds: ['fact_1', 'fact_2'],
      timelineAvailable: [0, 50, 100, 150],
    }
    localization.set(mockResult)
    appState.set('localized')
  }
</script>

<div class="tracking-screen">
  <!-- Video placeholder (in real app, this would be the camera feed) -->
  <div class="video-container">
    {#if videoPlaceholder}
      <div class="video-placeholder">
        <div class="placeholder-content">
          <div class="camera-icon">📱</div>
          <p>Camera feed would appear here</p>
          <p class="demo-note">Demo mode - using simulated tracking</p>
        </div>
      </div>
    {:else}
      <!-- In real app: video element with camera stream -->
      <video autoplay muted playsinline class="camera-feed" />
    {/if}
    
    <!-- AR overlay area -->
    <div class="ar-overlay">
      <!-- Tracking reticule -->
      <div class="reticule">
        <div class="circle outer" />
        <div class="circle inner" />
        <div class="crosshair" />
      </div>
      
      <!-- Status overlay -->
      <div class="status-overlay">
        <div class="status-item">
          <span class="label">Tracking:</span>
          <span class="value">{trackingStatus}</span>
        </div>
        <div class="status-item">
          <span class="label">Localization:</span>
          <span class="value">{progress.status}</span>
        </div>
        {#if progress.progress > 0}
          <div class="progress-bar">
            <div class="progress-fill" style={`width: ${progress.progress * 100}%`} />
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Bottom controls -->
  <div class="controls">
    <div class="instructions">
      <p>Point at a building and hold steady for localization</p>
    </div>
    
    <div class="actions">
      <button class="secondary" on:click={skipToDemo}>
        Skip to Demo
      </button>
      <button class="primary" on:click={() => appState.set('camera-ready')}>
        Restart
      </button>
    </div>
  </div>
</div>

<style>
  .tracking-screen {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #000;
    color: white;
  }
  
  .video-container {
    flex: 1;
    position: relative;
    background: #111;
    overflow: hidden;
  }
  
  .video-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(45deg, #1a202c, #2d3748);
  }
  
  .placeholder-content {
    text-align: center;
    padding: 2rem;
  }
  
  .camera-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }
  
  .demo-note {
    font-size: 0.9rem;
    opacity: 0.6;
    margin-top: 0.5rem;
  }
  
  .camera-feed {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .ar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  .reticule {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
  }
  
  .circle {
    position: absolute;
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 50%;
  }
  
  .circle.outer {
    width: 100%;
    height: 100%;
    border-color: rgba(66, 153, 225, 0.6);
  }
  
  .circle.inner {
    top: 25%;
    left: 25%;
    width: 50%;
    height: 50%;
    border-color: rgba(255, 255, 255, 0.9);
  }
  
  .crosshair {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 20px;
    background: rgba(255, 255, 255, 0.9);
  }
  
  .crosshair::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 2px;
    background: rgba(255, 255, 255, 0.9);
  }
  
  .status-overlay {
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  
  .status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  
  .label {
    opacity: 0.8;
  }
  
  .value {
    font-weight: 600;
    color: #63b3ed;
  }
  
  .progress-bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin-top: 8px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4299e1, #38b2ac);
    transition: width 0.3s ease;
  }
  
  .controls {
    background: rgba(30, 30, 30, 0.9);
    padding: 15px 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .instructions {
    text-align: center;
    margin-bottom: 10px;
    opacity: 0.9;
  }
  
  .actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  
  button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  button.primary {
    background: #4299e1;
    color: white;
  }
  
  button.primary:hover {
    background: #3182ce;
  }
  
  button.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  button.secondary:hover {
    background: rgba(255, 255, 255, 0.2);
  }
</style>