<script lang="ts">
  import { currentTimelineOffset } from '$stores/session'
  import { localization } from '$stores/session'
  
  export let availableOffsets: number[] = [0, 50, 100, 150] // Default
  export let disabled = false
  
  let loc = $localization
  let currentOffset = $currentTimelineOffset
  
  // Use available offsets from localization if provided
  $: if (loc?.timelineAvailable) {
    availableOffsets = loc.timelineAvailable
  }
  
  function handleChange(e: Event) {
    const target = e.target as HTMLInputElement
    const value = parseInt(target.value)
    const closest = availableOffsets.reduce((prev, curr) => {
      return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    })
    currentTimelineOffset.set(closest)
  }
  
  function getYearLabel(offset: number): string {
    if (offset === 0) return 'Present'
    if (offset > 0) return `${offset} years ago`
    return `${Math.abs(offset)} years in future`
  }
</script>

<div class="timeline-slider" class:disabled>
  <div class="labels">
    {#each availableOffsets as offset}
      <div
        class="label"
        class:active={offset === currentOffset}
        role="button"
        tabindex={disabled ? undefined : 0}
        aria-pressed={offset === currentOffset ? "true" : "false"}
        on:click={() => !disabled && currentTimelineOffset.set(offset)}
        on:keydown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            currentTimelineOffset.set(offset)
          }
        }}
      >
        {getYearLabel(offset)}
      </div>
    {/each}
  </div>
  
  <input
    type="range"
    min={Math.min(...availableOffsets)}
    max={Math.max(...availableOffsets)}
    step="10"
    bind:value={currentOffset}
    on:change={handleChange}
    disabled={disabled}
    class="slider"
  />
  
  <div class="current-display">
    <span class="icon">🕐</span>
    <span class="text">{getYearLabel(currentOffset)}</span>
  </div>
</div>

<style>
  .timeline-slider {
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
  
  .label {
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #4a5568;
    font-weight: 500;
  }
  
  .label:hover:not(.active) {
    background: #f7fafc;
    color: #2d3748;
  }
  
  .label.active {
    background: #4299e1;
    color: white;
    font-weight: 600;
  }
  
  .slider {
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
    appearance: none;
    background: linear-gradient(90deg, #a0aec0, #cbd5e0);
    border-radius: 4px;
    outline: none;
    margin: 1rem 0;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #4299e1;
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  .slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #4299e1;
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  .slider:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .slider:disabled::-webkit-slider-thumb {
    cursor: not-allowed;
    background: #a0aec0;
  }
  
  .current-display {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    padding: 0.75rem;
    background: #f7fafc;
    border-radius: 10px;
    font-weight: 600;
    color: #2d3748;
  }
  
  .icon {
    margin-right: 0.75rem;
    font-size: 1.2rem;
  }
  
  .timeline-slider.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
</style>