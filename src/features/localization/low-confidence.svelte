<script lang="ts">
  import { appState } from '$stores/appState'
  import { localization } from '$stores/session'
  
  let loc = $localization
  let confidencePercent = loc ? Math.round(loc.confidence * 100) : 0
</script>

<div class="low-confidence-screen">
  <div class="content">
    <div class="icon">⚠️</div>
    <h2>Low Confidence Match</h2>
    <p>We couldn't confidently identify the building.</p>
    
    <div class="confidence-display">
      <div class="confidence-value">{confidencePercent}%</div>
      <div class="confidence-bar">
        <div class="bar-fill" style={`width: ${confidencePercent}%`} />
      </div>
      <div class="confidence-label">Recognition Confidence</div>
    </div>
    
    <div class="suggestions">
      <h3>Suggestions:</h3>
      <ul>
        <li>• Move closer to the building</li>
        <li>• Ensure good lighting</li>
        <li>• Point directly at the building facade</li>
        <li>• Hold your device steady for 5 seconds</li>
      </ul>
    </div>
    
    <div class="actions">
      <button class="secondary" on:click={() => appState.set('tracking')}>
        🔄 Try Again
      </button>
      <button class="primary" on:click={() => appState.set('localized')}>
        👁️ View Anyway
      </button>
    </div>
    
    <p class="note">
      You can still view information, but AR overlays may not align perfectly.
    </p>
  </div>
</div>

<style>
  .low-confidence-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
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
    margin-bottom: 1rem;
  }
  
  p {
    line-height: 1.6;
    color: #4a5568;
    margin-bottom: 2rem;
  }
  
  .confidence-display {
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f7fafc;
    border-radius: 15px;
  }
  
  .confidence-value {
    font-size: 3rem;
    font-weight: 700;
    color: #e53e3e;
    margin-bottom: 1rem;
  }
  
  .confidence-bar {
    height: 12px;
    background: #e2e8f0;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }
  
  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #f6ad55, #e53e3e);
    border-radius: 6px;
    transition: width 0.5s ease;
  }
  
  .confidence-label {
    font-size: 0.9rem;
    color: #718096;
  }
  
  .suggestions {
    text-align: left;
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f0fff4;
    border-radius: 10px;
    border-left: 4px solid #48bb78;
  }
  
  .suggestions h3 {
    margin-top: 0;
    color: #2d3748;
    font-size: 1.2rem;
  }
  
  .suggestions ul {
    padding-left: 1.5rem;
    margin-bottom: 0;
  }
  
  .suggestions li {
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
  
  .note {
    font-size: 0.9rem;
    opacity: 0.7;
    margin-top: 1.5rem;
  }
</style>