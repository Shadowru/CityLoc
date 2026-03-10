<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { appState } from '$stores/appState'
  import { localization, currentTimelineOffset, historicalLayers } from '$stores/session'
  import { fetchHistoricalLayer } from '$services/api/client'
  import TimelineSlider from './timeline-slider.svelte'
  
  let loc = $localization
  let offset = $currentTimelineOffset
  let layers = $historicalLayers
  let isLoading = false
  let currentLayer: any = null
  let error: string | null = null
  
  onMount(() => {
    loadHistoricalLayer()
  })
  
  async function loadHistoricalLayer() {
    if (!loc?.sceneId) return
    
    isLoading = true
    error = null
    
    try {
      const layer = await fetchHistoricalLayer(loc.sceneId, offset)
      currentLayer = layer
      
      // Add to layers store if not already present
      if (!layers.some(l => l.yearOffset === offset)) {
        historicalLayers.update(existing => [...existing, layer])
      }
    } catch (err) {
      console.error('Failed to load historical layer:', err)
      error = 'Unable to load historical data for this time period.'
    } finally {
      isLoading = false
    }
  }
  
  function returnToPresent() {
    currentTimelineOffset.set(0)
    appState.set('localized')
  }
  
  function exitHistoricalMode() {
    appState.set('localized')
  }
  
  // Watch for timeline offset changes
  $: if (offset !== 0) {
    loadHistoricalLayer()
  }
</script>

<div class="historical-mode-screen">
  <!-- Historical AR View -->
  <div class="historical-view">
    <div class="viewport">
      <div class="time-period">
        <div class="time-label">{offset} years ago</div>
        <div class="time-icon">🕰️</div>
      </div>
      
      <!-- Historical overlay visualization -->
      <div class="historical-overlay">
        <div class="overlay-placeholder">
          <div class="building-icon">🏛️</div>
          <p>Historical Overlay Active</p>
          <p class="hint">Showing {offset}-year-old appearance</p>
        </div>
        
        {#if currentLayer?.assets?.overlayModelUrl}
          <div class="asset-info">
            <p>📦 Loading model: {currentLayer.assets.overlayModelUrl.split('/').pop()}</p>
          </div>
        {/if}
      </div>
      
      <!-- Comparison visual -->
      <div class="comparison">
        <div class="comparison-item present">
          <div class="label">Present</div>
          <div class="image-placeholder">Now</div>
        </div>
        <div class="comparison-arrow">→</div>
        <div class="comparison-item historical">
          <div class="label">{offset} years ago</div>
          <div class="image-placeholder">Then</div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Controls -->
  <div class="controls">
    <div class="timeline-control">
      <TimelineSlider disabled={isLoading} />
    </div>
    
    {#if isLoading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading historical data...</p>
      </div>
    {:else if error}
      <div class="error">
        <p>⚠️ {error}</p>
      </div>
    {:else if currentLayer}
      <div class="layer-info">
        <h4>Historical Period: {offset} years ago</h4>
        <div class="assets">
          {#if currentLayer.assets.overlayModelUrl}
            <div class="asset">
              <span class="icon">📦</span>
              <span>3D Model: {currentLayer.assets.overlayModelUrl.split('/').pop()}</span>
            </div>
          {/if}
          {#if currentLayer.assets.textureSetUrl}
            <div class="asset">
              <span class="icon">🎨</span>
              <span>Textures: {currentLayer.assets.textureSetUrl.split('/').pop()}/*</span>
            </div>
          {/if}
        </div>
      </div>
    {/if}
    
    <div class="actions">
      <button class="secondary" on:click={exitHistoricalMode}>
        ← Back to Present
      </button>
      <button class="primary" on:click={returnToPresent}>
        ⏱️ Reset Timeline
      </button>
    </div>
    
    <p class="note">
      Historical mode overlays a reconstruction based on archival images and historical records.
    </p>
  </div>
</div>

<style>
  .historical-mode-screen {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a202c, #2d3748);
    color: white;
  }
  
  .historical-view {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  
  .viewport {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .time-period {
    text-align: center;
    margin-bottom: 2rem;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
  }
  
  .time-label {
    font-size: 2rem;
    font-weight: 700;
    color: #f6ad55;
    margin-bottom: 0.5rem;
  }
  
  .time-icon {
    font-size: 2.5rem;
  }
  
  .historical-overlay {
    width: 100%;
    max-width: 600px;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    border: 2px solid #f6ad55;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .overlay-placeholder {
    padding: 1rem;
  }
  
  .building-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .hint {
    opacity: 0.8;
    font-size: 0.9rem;
  }
  
  .asset-info {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    font-size: 0.9rem;
  }
  
  .comparison {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .comparison-item {
    width: 120px;
    text-align: center;
  }
  
  .comparison-item .label {
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #a0aec0;
  }
  
  .comparison-item .image-placeholder {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    font-weight: 700;
  }
  
  .comparison-item.present .image-placeholder {
    background: rgba(66, 153, 225, 0.3);
    color: #63b3ed;
  }
  
  .comparison-item.historical .image-placeholder {
    background: rgba(246, 173, 85, 0.3);
    color: #f6ad55;
  }
  
  .comparison-arrow {
    font-size: 2rem;
    color: #a0aec0;
  }
  
  .controls {
    background: rgba(30, 30, 30, 0.95);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    overflow-y: auto;
    max-height: 50vh;
  }
  
  .timeline-control {
    margin-bottom: 1.5rem;
  }
  
  .loading {
    text-align: center;
    padding: 1.5rem;
  }
  
  .loading .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #f6ad55;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto 1rem;
  }
  
  .error {
    padding: 1rem;
    background: rgba(229, 62, 62, 0.1);
    border-radius: 10px;
    border: 1px solid rgba(229, 62, 62, 0.3);
    margin: 1rem 0;
    text-align: center;
  }
  
  .layer-info {
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    margin: 1rem 0;
  }
  
  .layer-info h4 {
    margin-top: 0;
    color: #f6ad55;
    margin-bottom: 1rem;
  }
  
  .assets {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .asset {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    font-size: 0.9rem;
  }
  
  .asset .icon {
    font-size: 1.2rem;
  }
  
  .actions {
    display: flex;
    gap: 0.75rem;
    margin: 1.5rem 0;
  }
  
  button {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  button.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  button.secondary:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  button.primary {
    background: #f6ad55;
    color: #1a202c;
  }
  
  button.primary:hover {
    background: #ed8936;
  }
  
  .note {
    text-align: center;
    font-size: 0.9rem;
    opacity: 0.7;
    margin-top: 1rem;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>