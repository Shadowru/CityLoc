<script lang="ts">
  import { appState } from '$stores/appState'
  
  let errorMessage = ''
  let isRequesting = false
  
  async function requestCamera() {
    if (isRequesting) return
    isRequesting = true
    errorMessage = ''
    
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer rear camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      // Success - stop the stream immediately (we'll start it properly in AR)
      stream.getTracks().forEach(track => track.stop())
      
      // Transition to camera-ready state
      appState.set('camera-ready')
    } catch (err) {
      console.error('Camera error:', err)
      errorMessage = err instanceof Error ? err.message : 'Failed to access camera'
    } finally {
      isRequesting = false
    }
  }
  
  // For demo purposes, also provide a skip button
  function skipCamera() {
    console.log('Skipping camera - demo mode')
    appState.set('camera-ready')
  }
</script>

<div class="camera-request">
  <div class="content">
    <div class="icon">📷</div>
    <h2>Camera Access Needed</h2>
    <p>CityLoc AR uses your camera to overlay historical information on real-world buildings.</p>
    
    <div class="permission-info">
      <h3>How your camera is used:</h3>
      <ul>
        <li>• Real-time AR tracking</li>
        <li>• Building recognition</li>
        <li>• No images are stored or uploaded without your consent</li>
      </ul>
    </div>
    
    {#if errorMessage}
      <div class="error">
        <p>{errorMessage}</p>
        <p class="help">Please check your browser permissions and try again.</p>
      </div>
    {/if}
    
    <div class="actions">
      <button
        class="primary"
        on:click={requestCamera}
        disabled={isRequesting}
      >
        {isRequesting ? 'Requesting...' : 'Allow Camera Access'}
      </button>
      
      <button
        class="secondary"
        on:click={skipCamera}
      >
        Try Demo Mode
      </button>
    </div>
    
    <p class="privacy-note">
      Your privacy is important. Camera access is only used for AR features and is not recorded.
    </p>
  </div>
</div>

<style>
  .camera-request {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  
  .permission-info {
    text-align: left;
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f7fafc;
    border-radius: 10px;
    border-left: 4px solid #4299e1;
  }
  
  .permission-info h3 {
    margin-top: 0;
    color: #2d3748;
  }
  
  .permission-info ul {
    padding-left: 1.5rem;
    margin-bottom: 0;
  }
  
  .permission-info li {
    margin-bottom: 0.5rem;
    color: #4a5568;
  }
  
  .error {
    margin: 1.5rem 0;
    padding: 1rem;
    background: #fed7d7;
    border-radius: 10px;
    color: #742a2a;
    text-align: left;
  }
  
  .help {
    font-size: 0.9rem;
    margin-top: 0.5rem;
    opacity: 0.8;
  }
  
  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem 0;
  }
  
  button {
    padding: 1rem 1.5rem;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  button.primary {
    background: #4299e1;
    color: white;
  }
  
  button.primary:hover:not(:disabled) {
    background: #3182ce;
    transform: translateY(-2px);
  }
  
  button.primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  button.secondary {
    background: #e2e8f0;
    color: #4a5568;
  }
  
  button.secondary:hover {
    background: #cbd5e0;
    transform: translateY(-2px);
  }
  
  .privacy-note {
    font-size: 0.9rem;
    opacity: 0.7;
    margin-top: 1.5rem;
  }
</style>