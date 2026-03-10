<script lang="ts">
  // Boot screen - simple loading
</script>

<div class="boot-screen">
  <div class="logo">
    <h1>CityLoc AR</h1>
    <p>Mobile Tourism Experience</p>
  </div>
  <div class="spinner"></div>
  <p class="hint">Initializing...</p>
</div>

<style>
  .boot-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
  }

  .logo {
    margin-bottom: 3rem;
  }

  .logo h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  .logo p {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 2rem;
  }

  .hint {
    font-size: 1rem;
    opacity: 0.8;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>