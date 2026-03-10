<script lang="ts">
  export let item: any
  export let position: [number, number, number] = [0, 0, 0]
  export let scale = 1
  
  // In real AR, this would be positioned based on item.position
  // For demo, we'll use fixed positions
  
  $: {
    if (item?.position) {
      position = item.position
    }
  }
  
  // Convert position to CSS (for demo purposes)
  // In real AR, this would use 3D transforms via WebGL
  const getStyle = () => {
    // Simple demo positioning - center with offset based on index
    return `left: 50%; top: 40%; transform: translate(-50%, -50%) scale(${scale});`
  }
</script>

<div class="fact-overlay" style={getStyle()}>
  <div class="fact-content">
    <div class="fact-header">
      <div class="fact-icon">
        {#if item.type === 'fact'}
          ℹ️
        {:else if item.type === 'narration'}
          🎵
        {:else}
          📍
        {/if}
      </div>
      <div class="fact-title">{item.title || 'Information'}</div>
    </div>
    
    {#if item.text}
      <div class="fact-text">{item.text}</div>
    {/if}
    
    <div class="fact-indicator">
      <div class="pulse"></div>
    </div>
  </div>
  
  <!-- Connection line to anchor point (visual only) -->
  <div class="anchor-line"></div>
</div>

<style>
  .fact-overlay {
    position: absolute;
    pointer-events: none;
    z-index: 100;
    min-width: 250px;
    max-width: 300px;
  }
  
  .fact-content {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    border: 2px solid #4299e1;
    position: relative;
    pointer-events: auto;
  }
  
  .fact-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  
  .fact-icon {
    font-size: 1.5rem;
    margin-right: 0.75rem;
  }
  
  .fact-title {
    font-weight: 700;
    color: #2d3748;
    font-size: 1.1rem;
  }
  
  .fact-text {
    color: #4a5568;
    line-height: 1.5;
    font-size: 0.95rem;
  }
  
  .fact-indicator {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 30px;
  }
  
  .pulse {
    width: 100%;
    height: 100%;
    background: #4299e1;
    border-radius: 50%;
    animation: pulse 2s ease-out infinite;
    opacity: 0.8;
  }
  
  .anchor-line {
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 2px;
    height: 50px;
    background: linear-gradient(to top, rgba(66, 153, 225, 0.8), transparent);
    transform: translateX(-50%);
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.8;
    }
    70% {
      transform: scale(1.2);
      opacity: 0.4;
    }
    100% {
      transform: scale(0.8);
      opacity: 0.8;
    }
  }
</style>