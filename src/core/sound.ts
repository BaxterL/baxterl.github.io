/** Tiny synthesised percussion set: every visual hit gets a printed-press sound. */

type Cue = 'tick' | 'thock' | 'clack' | 'blip' | 'click' | 'whoosh' | 'flap' | 'impact'

export class SoundKit {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private last: Record<string, number> = {}

  enabled = false

  constructor() {
    try {
      this.enabled = window.localStorage.getItem('baxterl:sound') === 'on'
    } catch {
      this.enabled = false
    }
  }

  private ensure(): AudioContext | null {
    if (!this.enabled) return null
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.34
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  setEnabled(v: boolean) {
    this.enabled = v
    try {
      window.localStorage.setItem('baxterl:sound', v ? 'on' : 'off')
    } catch {
      /* private mode */
    }
    if (v) {
      this.ensure()
      this.play('tick')
    }
  }

  play(cue: Cue, gain = 1) {
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    const now = performance.now()
    if (this.last[cue] && now - this.last[cue] < 35) return
    this.last[cue] = now
    const t = ctx.currentTime

    const noise = (dur: number, type: BiquadFilterType, freq: number, q: number, level: number) => {
      const len = Math.max(1, Math.floor(ctx.sampleRate * dur))
      const buf = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len)
      const src = ctx.createBufferSource()
      src.buffer = buf
      const filter = ctx.createBiquadFilter()
      filter.type = type
      filter.frequency.value = freq
      filter.Q.value = q
      const g = ctx.createGain()
      g.gain.value = level
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      src.connect(filter).connect(g).connect(this.master!)
      src.start(t)
    }

    const tone = (from: number, to: number, dur: number, type: OscillatorType, level: number) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(from, t)
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur)
      g.gain.setValueAtTime(level, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      osc.connect(g).connect(this.master!)
      osc.start(t)
      osc.stop(t + dur + 0.02)
    }

    switch (cue) {
      case 'tick':
        tone(2400, 1800, 0.025, 'square', 0.035 * gain)
        break
      case 'click':
        noise(0.035, 'bandpass', 2600, 1.4, 0.08 * gain)
        break
      case 'clack':
        noise(0.07, 'bandpass', 1500, 0.9, 0.13 * gain)
        tone(320, 180, 0.05, 'triangle', 0.05 * gain)
        break
      case 'thock':
        tone(190, 74, 0.16, 'sine', 0.2 * gain)
        noise(0.04, 'lowpass', 900, 0.7, 0.1 * gain)
        break
      case 'impact':
        tone(120, 42, 0.34, 'sine', 0.3 * gain)
        noise(0.12, 'lowpass', 420, 0.6, 0.16 * gain)
        break
      case 'blip':
        tone(1180, 760, 0.09, 'triangle', 0.08 * gain)
        break
      case 'flap':
        noise(0.055, 'bandpass', 1100, 2.2, 0.1 * gain)
        break
      case 'whoosh':
        noise(0.4, 'bandpass', 900, 0.6, 0.09 * gain)
        tone(140, 320, 0.3, 'sine', 0.04 * gain)
        break
    }
  }
}
