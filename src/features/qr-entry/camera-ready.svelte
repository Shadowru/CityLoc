<script lang="ts">
  import { onMount } from 'svelte'
  import { appState } from '$stores/appState'
  import { eighthWallService } from '$services/ar/eighthWall'
  
  let countdown = 3
  let isStarting = false
  
  onMount(() => {
    // Auto-start countdown
    const timer = setInterval(() => {
      if (countdown > 1) {
        countdown--
      } else {
        clearInterval(timer)
        startAR()
      }
    }, 1000)
    
    return () => clearInterval(timer)
  })
  
  async function startAR() {
    if (isStarting) return
    isStarting = true
    
    try {
      // Initialize 8th Wall (mock API key for demo)
      await eighthWallService.initialize('demo-api-key')
      
      // Transition to tracking state
      appState.set('tracking')
    } catch (error) {
      console.error('Failed to start AR:', error)
      // Fallback to demo mode
      appState.set('tracking')
    }
  }
  
  function skipCountdown() {
    countdown = 1
    startAR()
  }
</script>

<div class="camera-ready">
  <div class="content">
    <div class="icon">🎯</div>
    <h2>Ready to Scan</h2>
    <p>Point your camera at a building or landmark to see historical information.</p>
    
    <div class="instructions">
      <h3>Tips for best results:</h3>
      <ul>
        <li>• Hold your phone steady</li>
        <li>• Good lighting helps recognition</li>
        <li>• Move slowly around the building</li>
        <li>• Keep the building in frame</li>
      </ul>
    </div>
    
    <div class="countdown">
      <div class="countdown-number">{countdown}</div>
      <p>Starting AR in {countdown} second{countdown !== 1 ? 's' : ''}...</p>
    </div>
    
    <div class="actions">
      <button
        class="secondary"
        on:click={skipCountdown}
        disabled={isStarting}
      >
        {isStarting ? 'Starting...' : 'Start Now'}
      </button>
    </div>
  </div>
</div>

<style>
  .camera-ready {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: #333;
    padding: 2rem;
  }
  
  .content {
    background: rgba(255, 255, 255, 0.95);
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
    text-align: center;
  }
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
  
  h2 {
    margin-top: 0;
    color: #2d3748;
    font-size: 1.8rem;
  }
  
  p {
    line-height: 1.6;
    color: #4a5568;
  }
  
  .instructions {
    text-align: left;
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f7fafc;
    border-radius: 10px;
    border-left: 4px solid #48bb78;
  }
  
  .instructions h3 {
    margin-top: 0;
    color: #2d3748;
  }
  
  .instructions ul {
    padding-left: 1.5rem;
    margin-bottom: 0;
  }
  
  .instructions li {
    margin-bottom: 0.5rem;
    color: #4a5568;
  }
  
  .countdown {
    margin: 2rem 0;
  }
  
  .countdown-number {
    font-size: 5rem;
    font-weight: 700;
    color: #4299e1;
    line-height: 1;
    margin-bottom: 1rem;
  }
  
  .actions {
    margin-top: 2rem;
  }
  
  button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  button.secondary {
    background: #e2e8f0;
    color: #4a5568;
  }
  
  button.secondary:hover:not(:disabled) {
    background: #cbd5e0;
    transform: translateY(-2px);
  }
  
  button.secondary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>