// Audio narration service

class NarrationService {
  private audioContext: AudioContext | null = null
  private currentAudio: HTMLAudioElement | null = null
  private isPlaying = false

  async play(url: string, volume = 1.0): Promise<void> {
    // Stop any existing audio
    this.stop()

    // Create audio element
    const audio = new Audio(url)
    audio.volume = volume
    audio.preload = 'auto'

    // Play with user interaction requirement already satisfied
    try {
      await audio.play()
      this.currentAudio = audio
      this.isPlaying = true

      audio.addEventListener('ended', () => {
        this.isPlaying = false
        this.currentAudio = null
      })

      audio.addEventListener('error', () => {
        this.isPlaying = false
        this.currentAudio = null
      })
    } catch (error) {
      console.error('Failed to play audio:', error)
      this.isPlaying = false
      this.currentAudio = null
      throw error
    }
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio = null
    }
    this.isPlaying = false
  }

  pause(): void {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.isPlaying = false
    }
  }

  resume(): void {
    if (this.currentAudio && !this.isPlaying) {
      this.currentAudio.play().catch(console.error)
      this.isPlaying = true
    }
  }

  get playing(): boolean {
    return this.isPlaying
  }
}

export const narrationService = new NarrationService()