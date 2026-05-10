import { TravelMode } from '../types';

class AudioService {
  private ambient: HTMLAudioElement;
  private sfx: HTMLAudioElement;
  private volume = 0.4;
  private isMuted = false;
  private ctx: AudioContext | null = null;

  private paths: Record<string, string> = {
    flight: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_f5f6f4c7f0.mp3?filename=airplane-cabin-white-noise-10137.mp3',
    train: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_82c6b4d3a2.mp3?filename=train-traveling-8186.mp3',
    bus: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_73d12d6a54.mp3?filename=bus-engine-interior-10255.mp3',
    takeoff: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_f5f6f4c7f0.mp3?filename=airplane-cabin-white-noise-10137.mp3',
    landing: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_f5f6f4c7f0.mp3?filename=airplane-cabin-white-noise-10137.mp3',
    announcement: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_f5f6f4c7f0.mp3?filename=airplane-cabin-white-noise-10137.mp3',
    rain: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_338c92b23a.mp3?filename=light-rain-ambient-114354.mp3',
    cafe: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_9115b8822d.mp3?filename=coffee-shop-chill-25465.mp3'
  };

  constructor() {
    this.ambient = new Audio();
    this.ambient.loop = true;
    this.sfx = new Audio();
  }

  private async initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        // Browser autoplay policies can reject resume outside user interaction.
      }
    }
  }

  async startProceduralEngine(mode: TravelMode) {
    await this.initContext();
    if (!this.ctx) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = mode === 'flight' ? 400 : mode === 'train' ? 300 : 250;
    filter.Q.value = 1;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.03 * this.volume;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
    return whiteNoise;
  }

  playAmbient(mode: string) {
    if (this.isMuted) return;

    const newSrc = this.paths[mode] || this.paths.flight;
    if (this.ambient.src !== newSrc) {
      this.ambient.src = newSrc;
    }

    this.ambient.volume = this.volume;
    if (this.ambient.paused) {
      this.ambient.play().catch(() => {
        // Browser can block autoplay without a user gesture.
      });
    }
  }

  playSFX(name: string) {
    if (this.isMuted) return;

    this.sfx.src = this.paths[name] || this.paths.announcement;
    this.sfx.volume = 0.6;
    this.sfx.play().catch(() => {
      // Browser can block autoplay without a user gesture.
    });
  }

  setVolume(v: number) {
    const normalized = Math.max(0, Math.min(1, v));
    this.volume = normalized;
    this.ambient.volume = normalized;
  }

  toggle() {
    if (this.ambient.paused) {
      this.ambient.play().catch(() => {
        // Browser can block autoplay without a user gesture.
      });
      this.isMuted = false;
    } else {
      this.ambient.pause();
      this.isMuted = true;
    }
    return !this.isMuted;
  }

  setAmbient(type: string, customUrl?: string) {
    if (customUrl) {
      this.paths.custom = customUrl;
      this.playAmbient('custom');
      return;
    }
    this.playAmbient(type);
  }

  stopAll() {
    this.ambient.pause();
    this.sfx.pause();
    if (this.ctx) {
      this.ctx.suspend().catch(() => {
        // Context may already be suspended.
      });
    }
  }
}

export const audioService = new AudioService();
