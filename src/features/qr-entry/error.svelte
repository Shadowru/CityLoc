<script lang="ts">
  import { appState } from '$stores/appState'
  import { resetSession } from '$stores/session'
  
  let errorDetails = 'An unexpected error occurred'
  
  // Try to get error from URL
  const urlParams = new URLSearchParams(window.location.search)
  const errorParam = urlParams.get('error')
  if (errorParam) {
    errorDetails = decodeURIComponent(errorParam)
  }
  
  function retry() {
    // Reset session and go back to boot
    resetSession()
    appState.set('boot')
    
    // Reload page to restart
    setTimeout(() => {
      window.location.href = window.location.pathname
    }, 100)
  }
  
  function tryDemo() {
    resetSession()
    // Set demo mode flag in URL
    const url = new URL(window.location.href)
    url.searchParams.set('demo', 'true')
    url.searchParams.delete('error')
    window.location.href = url.toString()
  }
</script>

<div class="error-screen">
  <div class="content">
    <div class="icon">❌</div>
    <h2>Something Went Wrong</h2>
    <p>We encountered an error while setting up the AR experience.</p>
    
    <div class="error-details">
      <h3>Error Details:</h3>
      <code>{errorDetails}</code>
    </div>
    
    <div class="troubleshooting">
      <h3>What you can try:</h3>
      <ul>
        <li>• Check your internet connection</li>
        <li>• Ensure camera permissions are granted</li>
        <li>• Try a different browser (Chrome/Safari recommended)</li>
        <li>• Restart the app</li>
      </ul>
    </div>
    
    <div class="actions">
      <button class="secondary" on:click={retry}>
        🔄 Retry
      </button>
      <button class="primary" on:click={tryDemo}>
        🎮 Try Demo Mode
      </button>
    </div>
    
    <p class="support">
      If the problem persists, please contact support with the error details above.
    </p>
  </div>
</div>

<style>
  .error-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
    color: white;
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
    color: #333;
  }
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    color: #e53e3e;
  }
  
  h2 {
    margin-top: 0;
    color: #2d3748;
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  p {
    line-height: 1.6;
    color: #4a5568;
    margin-bottom: 2rem;
  }
  
  .error-details {
    text-align: left;
    margin: 2rem 0;
    padding: 1.5rem;
    background: #fed7d7;
    border-radius: 10px;
    border-left: 4px solid #e53e3e;
  }
  
  .error-details h3 {
    margin-top: 0;
    color: #742a2a;
    font-size: 1.1rem;
  }
  
  .error-details code {
    display: block;
    padding: 1rem;
    background: rgba(229, 62, 62, 0.1);
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.9rem;
    color: #742a2a;
    word-break: break-word;
    white-space: pre-wrap;
  }
  
  .troubleshooting {
    text-align: left;
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f7fafc;
    border-radius: 10px;
    border-left: 4px solid #4299e1;
  }
  
  .troubleshooting h3 {
    margin-top: 0;
    color: #2d3748;
    font-size: 1.1rem;
  }
  
  .troubleshooting ul {
    padding-left: 1.5rem;
    margin-bottom: 0;
  }
  
  .troubleshooting li {
    margin-bottom: 0.5rem;
    color: #4a5568;
  }
  
  .actions {
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
  }
  
  button {
    flex: 1;
    padding: 1rem 1.5rem;
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
  
  button.secondary:hover {
    background: #cbd5e0;
    transform: translateY(-2px);
  }
  
  button.primary {
    background: #4299e1;
    color: white;
  }
  
  button.primary:hover {
    background: #3182ce;
    transform: translateY(-2px);
  }
  
  .support {
    font-size: 0.9rem;
    opacity: 0.7;
    margin-top: 1.5rem;
  }
</style>