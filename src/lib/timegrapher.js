// A microphone timegrapher. Listens to a watch's ticks and measures rate
// (seconds/day) and beat error (ms) — the two readings you can get honestly
// from a phone mic. Amplitude is deliberately NOT estimated: it needs the
// escapement's three sub-sounds cleanly separated plus the lift angle, which a
// phone mic in a normal room can't deliver reliably, and a wrong amplitude
// number is worse than none.
//
// No dependencies: raw Web Audio, a peak-follower onset detector, and interval
// statistics. Everything runs live on-device; nothing is recorded or sent.

const COMMON_BPH = [18000, 19800, 21600, 25200, 28800, 36000, 43200]

const avg = (a) => a.reduce((s, x) => s + x, 0) / a.length

export function createTimegrapher() {
  let ctx = null
  let stream = null
  let source = null
  let processor = null
  let running = false

  const beats = [] // absolute onset times (seconds, AudioContext clock)
  let onBeat = () => {}

  // onset-detector state
  let threshold = 0
  let noiseEnv = 0
  let sinceLast = 1e9

  function handleAudio(e) {
    const input = e.inputBuffer
    const data = input.getChannelData(0)
    const sr = ctx.sampleRate
    const refractory = Math.round(0.05 * sr) // 50 ms → max ~1200 bpm-equivalent, well above any beat rate
    const bufStart = ctx.currentTime - input.duration
    const MIN_T = 0.006

    for (let i = 0; i < data.length; i++) {
      const a = Math.abs(data[i])
      noiseEnv = noiseEnv * 0.9997 + a * 0.0003
      const dynT = Math.max(MIN_T, noiseEnv * 4)
      if (threshold < dynT) threshold = dynT

      if (sinceLast >= refractory && a > threshold) {
        const t = bufStart + i / sr
        beats.push(t)
        if (beats.length > 400) beats.shift()
        try {
          onBeat(t, beats.length)
        } catch {
          /* ignore listener errors */
        }
        threshold = a * 0.7
        sinceLast = 0
      } else {
        sinceLast++
        threshold = Math.max(threshold * 0.9996, dynT)
      }
    }
    // keep the graph silent (don't echo the mic to the speaker)
    const out = e.outputBuffer.getChannelData(0)
    out.fill(0)
  }

  async function start() {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
      },
    })
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') await ctx.resume()
    source = ctx.createMediaStreamSource(stream)
    processor = ctx.createScriptProcessor(2048, 1, 1)
    processor.onaudioprocess = handleAudio
    source.connect(processor)
    processor.connect(ctx.destination)
    running = true
    beats.length = 0
    threshold = 0
    noiseEnv = 0
    sinceLast = 1e9
  }

  async function stop() {
    running = false
    try {
      processor && (processor.onaudioprocess = null)
      processor && processor.disconnect()
      source && source.disconnect()
    } catch {
      /* ignore */
    }
    try {
      stream && stream.getTracks().forEach((t) => t.stop())
    } catch {
      /* ignore */
    }
    try {
      ctx && (await ctx.close())
    } catch {
      /* ignore */
    }
    ctx = source = processor = stream = null
  }

  // Compute rate + beat error from the recent beats. `bphOverride` forces a
  // known beat rate; otherwise it auto-detects the nearest common value.
  function stats(bphOverride) {
    const ts = beats.slice(-240)
    if (ts.length < 10) return { ready: false, beats: ts.length }

    const iv = []
    for (let i = 1; i < ts.length; i++) iv.push(ts[i] - ts[i - 1])

    const sorted = [...iv].sort((a, b) => a - b)
    const median = sorted[sorted.length >> 1]
    if (!median || !isFinite(median)) return { ready: false, beats: ts.length }

    const clean = iv.filter((x) => x > median * 0.6 && x < median * 1.6)
    if (clean.length < 8) return { ready: false, beats: ts.length }

    const mean = avg(clean)
    const rawBph = 3600 / mean
    const bph =
      bphOverride ||
      COMMON_BPH.reduce((p, c) => (Math.abs(c - rawBph) < Math.abs(p - rawBph) ? c : p), COMMON_BPH[0])
    const T = 3600 / bph
    const rate = (T / mean - 1) * 86400

    // beat error: asymmetry between alternating (tick vs tock) gaps
    const even = []
    const odd = []
    for (let i = 0; i < iv.length; i++) {
      if (iv[i] > median * 0.6 && iv[i] < median * 1.6) (i % 2 ? odd : even).push(iv[i])
    }
    const beatError = even.length && odd.length ? Math.abs(avg(even) - avg(odd)) * 1000 : 0

    const sd = Math.sqrt(avg(clean.map((x) => (x - mean) ** 2)))
    const stability = Math.max(0, 1 - Math.min(1, (sd / mean) * 25))

    return {
      ready: true,
      bph,
      rawBph,
      rate,
      beatError,
      beats: ts.length,
      stability,
      snapped: Math.abs(bph - rawBph) < bph * 0.04,
    }
  }

  return {
    start,
    stop,
    stats,
    get running() {
      return running
    },
    set onBeat(fn) {
      onBeat = typeof fn === 'function' ? fn : () => {}
    },
    // expected interval (s) for the drift trace
    interval(bph) {
      return 3600 / bph
    },
    beats,
  }
}

export { COMMON_BPH }
