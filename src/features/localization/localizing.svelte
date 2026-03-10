<script lang="ts">
  import { localizationProgress } from '$stores/localization'
  
  let progress = $localizationProgress
</script>

<div class="localizing-screen">
  <div class="content">
    <div class="spinner-container">
      <div class="spinner"></div>
      <div class="pulse"></div>
    </div>
    
    <h2>Identifying Building</h2>
    <p>Analyzing camera feed to recognize the landmark...</p>
    
    <div class="progress-container">
      <div class="progress-label">
        <span>Progress:</span>
        <span>{Math.round(progress.progress * 100)}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style={`width: ${progress.progress * 100}%`} />
      </div>
    </div>
    
    <div class="status-message">
      {#if progress.status === 'sampling'}
        <p>📷 Capturing image samples...</p>
      {:else if progress.status === 'uploading'}
        <p>📤 Uploading for analysis...</p>
      {:else if progress.status === 'processing'}
        <p>🔍 Comparing with reference database...</p>
      {/if}
    </div>
    
    <div class="hint">
      <p>💡 Keep your device steady and pointed at the building</p>
    </div>
  </div>
</div>

<style>
  .localizing-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
  }
  
  .content {
    text-align: center;
    max-width: 500px;
    width: 100%;
  }
  
  .spinner-container {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 2rem;
  }
  
  .spinner {
    width: 100%;
    height: 100%;
    border: 6px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1.5s ease-in-out infinite;
  }
  
  .pulse {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 6px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: pulse 2s ease-out infinite;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
    line-height: 1.6;
  }
  
  .progress-container {
    margin: 2.5rem 0;
    background: rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    border-radius: 15px;
  }
  
  .progress-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  .progress-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #43e97b, #38f9d7);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .status-message {
    margin: 2rem 0;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    font-size: 1.2rem;
  }
  
  .hint {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 1rem;
    opacity: 0.8;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.8;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
</style>