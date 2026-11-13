// Procedural sound design. Every long-lived source belongs to one ambient session.
let context: AudioContext | null = null;
let master: GainNode | null = null;
let soundEnabled = false;
let volume = 0.55;

interface AmbientSession {
  bus: GainNode;
  sources: Set<AudioScheduledSourceNode>;
  timers: Set<number>;
  subGain: GainNode;
  airGain: GainNode;
  colorGain: GainNode;
  windFilter: BiquadFilterNode;
  tension: number;
}

let ambient: AmbientSession | null = null;

interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext;
}

function audio(): { ctx: AudioContext; output: GainNode } {
  if (!context) {
    const AudioContextClass = window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;
    if (!AudioContextClass) throw new Error('Web Audio is unavailable');
    context = new AudioContextClass();
    master = context.createGain();
    master.gain.value = soundEnabled ? volume * 0.28 : 0;
    master.connect(context.destination);
  }
  if (context.state === 'suspended') void context.resume().catch(() => {});
  return { ctx: context, output: master! };
}

export function unlockAudio(): void {
  try { audio(); } catch { /* Audio is optional. */ }
}

export function setAudioPreferences(enabled: boolean, nextVolume: number): void {
  soundEnabled = enabled;
  volume = Math.max(0, Math.min(1, nextVolume));
  if (context && master) {
    master.gain.setTargetAtTime(enabled ? volume * 0.28 : 0, context.currentTime, 0.035);
  }
  if (!enabled) stopAmbientSound();
}

function transient(
  frequency: number,
  destination: number,
  duration: number,
  peak: number,
  type: OscillatorType = 'sine',
  delay = 0,
): void {
  if (!soundEnabled) return;
  try {
    const { ctx, output } = audio();
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, destination), start + duration);
    env.gain.setValueAtTime(0.0001, start);
    env.gain.exponentialRampToValueAtTime(peak, start + Math.min(0.035, duration / 4));
    env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(env);
    env.connect(output);
    osc.onended = () => { osc.disconnect(); env.disconnect(); };
    osc.start(start);
    osc.stop(start + duration + 0.01);
  } catch { /* Audio is optional. */ }
}

function noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.35;
  }
  return buffer;
}

function track(session: AmbientSession, source: AudioScheduledSourceNode): void {
  session.sources.add(source);
  source.onended = () => { session.sources.delete(source); source.disconnect(); };
}

function schedule(session: AmbientSession, callback: () => void, delay: number): void {
  const id = window.setTimeout(() => {
    session.timers.delete(id);
    if (ambient === session) callback();
  }, delay);
  session.timers.add(id);
}

function playAirAccent(session: AmbientSession): void {
  if (!context || ambient !== session) return;
  const ctx = context;
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const env = ctx.createGain();
  source.buffer = noiseBuffer(ctx, 0.9);
  filter.type = 'bandpass';
  filter.frequency.value = 420 + Math.random() * 500;
  filter.Q.value = 1.3;
  const now = ctx.currentTime;
  env.gain.setValueAtTime(0.0001, now);
  env.gain.exponentialRampToValueAtTime(0.14 + session.tension * 0.02, now + 0.16);
  env.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
  source.connect(filter);
  filter.connect(env);
  env.connect(session.bus);
  track(session, source);
  source.start(now);
  source.stop(now + 0.9);
  source.addEventListener('ended', () => { filter.disconnect(); env.disconnect(); }, { once: true });
}

function playHeartbeat(session: AmbientSession): void {
  if (!context || ambient !== session || session.tension < 3) return;
  const ctx = context;
  for (const [delay, strength] of [[0, 0.09], [0.17, 0.055]] as const) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    const start = ctx.currentTime + delay;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(58, start);
    osc.frequency.exponentialRampToValueAtTime(38, start + 0.16);
    env.gain.setValueAtTime(0.0001, start);
    env.gain.exponentialRampToValueAtTime(strength, start + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
    osc.connect(env);
    env.connect(session.bus);
    track(session, osc);
    osc.addEventListener('ended', () => env.disconnect(), { once: true });
    osc.start(start);
    osc.stop(start + 0.21);
  }
}

function scheduleAccents(session: AmbientSession): void {
  schedule(session, () => {
    playAirAccent(session);
    scheduleAccents(session);
  }, 9000 + Math.random() * 9000 - session.tension * 900);
}

function scheduleHeartbeat(session: AmbientSession): void {
  schedule(session, () => {
    playHeartbeat(session);
    scheduleHeartbeat(session);
  }, 1100 - session.tension * 70);
}

export function startAmbientSound(tensionLevel = 0): void {
  if (!soundEnabled) return;
  if (ambient) {
    updateTensionAudio(tensionLevel);
    return;
  }
  try {
    const { ctx, output } = audio();
    const now = ctx.currentTime;
    const bus = ctx.createGain();
    bus.gain.setValueAtTime(0.0001, now);
    bus.gain.setTargetAtTime(1, now, 0.55);
    bus.connect(output);

    const subGain = ctx.createGain();
    const colorGain = ctx.createGain();
    const airGain = ctx.createGain();
    subGain.connect(bus);
    colorGain.connect(bus);

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.Q.value = 0.65;
    const panner = ctx.createStereoPanner();
    windFilter.connect(airGain);
    airGain.connect(panner);
    panner.connect(bus);

    const session: AmbientSession = {
      bus, sources: new Set(), timers: new Set(), subGain, airGain, colorGain,
      windFilter, tension: Math.max(0, Math.min(4, tensionLevel)),
    };
    ambient = session;

    for (const frequency of [55, 55.7]) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = frequency;
      osc.connect(subGain);
      track(session, osc);
      osc.start(now);
    }
    const color = ctx.createOscillator();
    color.type = 'triangle';
    color.frequency.value = 146.8;
    color.connect(colorGain);
    track(session, color);
    color.start(now);

    const wind = ctx.createBufferSource();
    wind.buffer = noiseBuffer(ctx, 3);
    wind.loop = true;
    wind.connect(windFilter);
    track(session, wind);
    wind.start(now);

    const panLfo = ctx.createOscillator();
    const panDepth = ctx.createGain();
    panLfo.frequency.value = 0.055;
    panDepth.gain.value = 0.42;
    panLfo.connect(panDepth);
    panDepth.connect(panner.pan);
    track(session, panLfo);
    panLfo.start(now);

    updateTensionAudio(session.tension);
    scheduleAccents(session);
    scheduleHeartbeat(session);
  } catch { stopAmbientSound(); }
}

export function updateTensionAudio(tensionLevel: number): void {
  if (!ambient || !context) return;
  const session = ambient;
  session.tension = Math.max(0, Math.min(4, tensionLevel));
  const now = context.currentTime;
  session.subGain.gain.setTargetAtTime(0.032 + session.tension * 0.005, now, 0.7);
  session.colorGain.gain.setTargetAtTime(0.012 + session.tension * 0.003, now, 0.7);
  session.airGain.gain.setTargetAtTime(0.11 + session.tension * 0.025, now, 0.7);
  session.windFilter.frequency.setTargetAtTime(310 + session.tension * 80, now, 0.7);
}

export function stopAmbientSound(): void {
  const session = ambient;
  if (!session || !context) return;
  ambient = null;
  for (const timer of session.timers) window.clearTimeout(timer);
  session.timers.clear();
  const now = context.currentTime;
  session.bus.gain.cancelScheduledValues(now);
  session.bus.gain.setTargetAtTime(0.0001, now, 0.12);
  window.setTimeout(() => {
    for (const source of session.sources) {
      try { source.stop(); } catch { /* Already ended. */ }
      source.disconnect();
    }
    session.sources.clear();
    session.bus.disconnect();
  }, 550);
}

export function isAmbientActive(): boolean {
  return ambient !== null;
}

export function playClick(): void {
  transient(260, 95, 0.075, 0.045, 'triangle');
}

export function playHum(): void {
  transient(80, 48, 0.95, 0.06, 'sine');
}

export function playRitual(): void {
  transient(55, 65, 3.6, 0.075, 'sine');
  transient(112, 108, 2.8, 0.018, 'triangle', 0.5);
}

export function playEntityResponse(): void {
  transient(126, 96, 1.15, 0.055, 'sine');
  transient(128, 94, 1.1, 0.026, 'sine', 0.05);
}

export function playIntrusion(): void {
  transient(105, 72, 1.2, 0.06, 'sine');
  transient(112, 68, 1.05, 0.022, 'triangle', 0.08);
}

export function playLetterSound(charIndex: number): void {
  if (charIndex % 2 !== 0) return;
  const frequency = 240 + (charIndex % 5) * 27;
  transient(frequency, frequency * 0.55, 0.075, 0.045, 'triangle');
}

export function playAnswerComplete(): void {
  transient(82, 54, 0.36, 0.07, 'sine');
  transient(220, 165, 0.7, 0.02, 'sine', 0.08);
}
