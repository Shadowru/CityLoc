<script lang="ts">
  import { qrEntry } from '$stores/session'
  
  let entry = $qrEntry
</script>

<div class="qr-resolver">
  <div class="content">
    <h2>Resolving QR Code</h2>
    <p>Loading location information...</p>
    
    {#if entry}
      <div class="success">
        <p>✓ Found location: <strong>{entry.locationId}</strong></p>
        <p>Route: {entry.routeId}</p>
      </div>
    {:else}
      <div class="spinner"></div>
    {/if}
  </div>
</div>

<style>
  .qr-resolver {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: #333;
    text-align: center;
    padding: 2rem;
  }

  .content {
    background: rgba(255, 255, 255, 0.9);
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
  }

  h2 {
    margin-top: 0;
    color: #2d3748;
  }

  .success {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #c6f6d5;
    border-radius: 10px;
    color: #22543d;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(66, 153, 225, 0.3);
    border-radius: 50%;
    border-top-color: #4299e1;
    animation: spin 1s ease-in-out infinite;
    margin: 2rem auto;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>