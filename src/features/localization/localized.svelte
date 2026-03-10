<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { appState } from '$stores/appState'
  import { localization, currentTimelineOffset } from '$stores/session'
  import { fetchContent } from '$services/api/client'
  import { narrationService } from '$services/audio/narration'
  import FactOverlay from '$features/overlays/fact-overlay.svelte'
  import TimelineSlider from '$features/timeline/timeline-slider.svelte'
  
  let loc = $localization
  let timelineOffset = $currentTimelineOffset
  let contentItems: any[] = []
  let isLoadingContent = true
  let activeFactIndex = 0
  let isPlayingNarration = false
  
  onMount(() => {
    // Load content asynchronously
    if (loc?.contentIds) {
      fetchContent(loc.contentIds)
        .then(items => {
          contentItems = items
          // Auto-play first narration if available (with user interaction requirement)
          const narration = items.find(item => item.type === 'narration')
          if (narration?.audioUrl) {
            // Note: Audio will only play if user has interacted with page
            // We'll wait for explicit user action
          }
        })
        .catch(error => {
          console.error('Failed to load content:', error)
        })
        .finally(() => {
          isLoadingContent = false
        })
    } else {
      isLoadingContent = false
    }
    
    // Setup timeline change listener
    const unsubscribe = currentTimelineOffset.subscribe(offset => {
      if (offset !== 0) {
        // Switch to historical mode
        appState.set('historical-mode')
      }
    })
    
    return () => unsubscribe()
  })
  
  onDestroy(() => {
    narrationService.stop()
  })
  
  function playNarration(audioUrl?: string) {
    if (!audioUrl) return
    
    if (narrationService.playing) {
      narrationService.stop()
      isPlayingNarration = false
    } else {
      narrationService.play(audioUrl)
        .then(() => {
          isPlayingNarration = true
        })
        .catch(error => {
          console.error('Failed to play narration:', error)
          // Show error to user
          alert('Unable to play audio. Please ensure you have interacted with the page first.')
        })
    }
  }
  
  function nextFact() {
    if (contentItems.length > 0) {
      activeFactIndex = (activeFactIndex + 1) % contentItems.length
    }
  }
  
  function previousFact() {
    if (contentItems.length > 0) {
      activeFactIndex = (activeFactIndex - 1 + contentItems.length) % contentItems.length
    }
  }
  
  function returnToTracking() {
    appState.set('tracking')
  }
</script>

<div class="localized-screen">
  <!-- AR View Area -->
  <div class="ar-view">
    <div class="video-placeholder">
      <div class="placeholder-content">
        <div class="ar-icon">🏛️</div>
        <p>AR Overlay Active</p>
        <p class="confidence">Confidence: {loc ? Math.round(loc.confidence * 100) : 0}%</p>
      </div>
    </div>
    
    <!-- Fact Overlays -->
    {#if !isLoadingContent && contentItems.length > 0}
      {#each contentItems as item, i}
        {#if i === activeFactIndex}
          <FactOverlay {item} />
        {/if}
      {/each}
    {/if}
  </div>
  
  <!-- Bottom Panel -->
  <div class="control-panel">
    <div class="building-info">
      <h3>{loc?.buildingId || 'Building'}</h3>
      <p>{loc?.sceneId || 'Scene'}</p>
    </div>
    
    <!-- Timeline Slider -->
    <div class="timeline-section">
      <TimelineSlider />
    </div>
    
    <!-- Content Navigation -->
    {#if !isLoadingContent && contentItems.length > 0}
      <div class="content-navigation">
        <div class="content-header">
          <h4>{contentItems[activeFactIndex]?.title || 'Fact'}</h4>
          <div class="content-counter">
            {activeFactIndex + 1} / {contentItems.length}
          </div>
        </div>
        
        <div class="content-body">
          <p>{contentItems[activeFactIndex]?.text || 'No content available'}</p>
        </div>
        
        <div class="content-actions">
          <button
            class="nav-button"
            on:click={previousFact}
            disabled={contentItems.length <= 1}
          >
            ← Previous
          </button>
          
          {#if contentItems[activeFactIndex]?.type === 'narration' && contentItems[activeFactIndex]?.audioUrl}
            <button
              class="narration-button"
              on:click={() => playNarration(contentItems[activeFactIndex].audioUrl)}
              class:playing={isPlayingNarration}
            >
              {isPlayingNarration ? '⏸️ Stop Narration' : '▶️ Play Narration'}
            </button>
          {/if}
          
          <button
            class="nav-button"
            on:click={nextFact}
            disabled={contentItems.length <= 1}
          >
            Next →
          </button>
        </div>
      </div>
    {:else if isLoadingContent}
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Loading content...</p>
      </div>
    {:else}
      <div class="no-content">
        <p>No content available for this location.</p>
      </div>
    {/if}
    
    <!-- Global Actions -->
    <div class="global-actions">
      <button class="secondary" on:click={returnToTracking}>
        🔍 Rescan
      </button>
      <button class="primary" on:click={() => appState.set('historical-mode')}>
        🕰️ Historical View
      </button>
    </div>
  </div>
</div>

<style>
  .localized-screen {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #000;
    color: white;
  }
  
  .ar-view {
    flex: 1;
    position: relative;
    background: linear-gradient(45deg, #1a202c, #2d3748);
    overflow: hidden;
  }
  
  .video-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .placeholder-content {
    text-align: center;
    padding: 2rem;
  }
  
  .ar-icon {
    font-size: 5rem;
    margin-bottom: 1rem;
    opacity: 0.8;
  }
  
  .confidence {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    display: inline-block;
    font-size: 0.9rem;
  }
  
  .control-panel {
    background: rgba(30, 30, 30, 0.95);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    overflow-y: auto;
    max-height: 50vh;
  }
  
  .building-info {
    text-align: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .building-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: #63b3ed;
  }
  
  .building-info p {
    margin: 0;
    opacity: 0.7;
    font-size: 0.9rem;
  }
  
  .timeline-section {
    margin: 1.5rem 0;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  
  .content-navigation {
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  
  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .content-header h4 {
    margin: 0;
    font-size: 1.2rem;
    color: #fff;
  }
  
  .content-counter {
    padding: 0.25rem 0.75rem;
    background: rgba(66, 153, 225, 0.2);
    border-radius: 12px;
    font-size: 0.9rem;
    color: #63b3ed;
  }
  
  .content-body {
    margin-bottom: 1.5rem;
  }
  
  .content-body p {
    line-height: 1.6;
    opacity: 0.9;
    margin: 0;
  }
  
  .content-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .nav-button {
    padding: 0.75rem 1.25rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
  }
  
  .nav-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .nav-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .narration-button {
    padding: 0.75rem 1.5rem;
    border: none;
    background: #4299e1;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  .narration-button:hover {
    background: #3182ce;
  }
  
  .narration-button.playing {
    background: #e53e3e;
  }
  
  .narration-button.playing:hover {
    background: #c53030;
  }
  
  .loading-content {
    text-align: center;
    padding: 2rem;
  }
  
  .loading-content .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #4299e1;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto 1rem;
  }
  
  .no-content {
    text-align: center;
    padding: 2rem;
    opacity: 0.7;
  }
  
  .global-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .global-actions button {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .global-actions .secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .global-actions .secondary:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .global-actions .primary {
    background: #48bb78;
    color: white;
  }
  
  .global-actions .primary:hover {
    background: #38a169;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>