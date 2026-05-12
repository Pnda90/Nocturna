// Audio context for NOCTURNA - Enhanced atmospheric sounds with tension system
let audioContext: AudioContext | null = null;
let gainNode: GainNode | null = null;
let ambientNodes: OscillatorNode[] = [];
let ambientGains: GainNode[] = [];
let isAmbientPlaying = false;
let currentTensionLevel = 0; // 0-4 scale

interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext;
}

function getAudioContext(): { ctx: AudioContext; gain: GainNode } {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('AudioContext not supported');
    }
    audioContext = new AudioContextClass();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = 0.15;
  }
  return { ctx: audioContext, gain: gainNode! };
}

export function playClick(): void {
  try {
    const { ctx, gain } = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    
    // Wooden tap sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.06);
    
    envelope.gain.setValueAtTime(0.15, ctx.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    
    oscillator.connect(envelope);
    envelope.connect(gain);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.06);
  } catch (e) {
    // Audio not supported or blocked
  }
}

export function playHum(): void {
  try {
    const { ctx, gain } = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    // Deep rumbling hum
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(45, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(55, ctx.currentTime + 1);
    oscillator.frequency.linearRampToValueAtTime(40, ctx.currentTime + 2);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    
    envelope.gain.setValueAtTime(0, ctx.currentTime);
    envelope.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.8);
    envelope.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2.5);
    envelope.gain.linearRampToValueAtTime(0, ctx.currentTime + 4);
    
    oscillator.connect(filter);
    filter.connect(envelope);
    envelope.connect(gain);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 4);
  } catch (e) {
    // Audio not supported or blocked
  }
}

export function playRitual(): void {
  try {
    const { ctx, gain } = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    // Ethereal rising tone
    const drone = ctx.createOscillator();
    const droneGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    drone.type = 'sine';
    drone.frequency.setValueAtTime(40, ctx.currentTime);
    drone.frequency.linearRampToValueAtTime(60, ctx.currentTime + 3);
    drone.frequency.linearRampToValueAtTime(55, ctx.currentTime + 5);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(300, ctx.currentTime + 4);
    
    droneGain.gain.setValueAtTime(0, ctx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 1.5);
    droneGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 4);
    droneGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 6);
    
    drone.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(gain);
    
    drone.start(ctx.currentTime);
    drone.stop(ctx.currentTime + 6);
    
    // Ghostly harmonic
    const harmonic = ctx.createOscillator();
    const harmonicGain = ctx.createGain();
    
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(120, ctx.currentTime + 1);
    harmonic.frequency.linearRampToValueAtTime(180, ctx.currentTime + 4);
    
    harmonicGain.gain.setValueAtTime(0, ctx.currentTime + 1);
    harmonicGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2.5);
    harmonicGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 5);
    
    harmonic.connect(harmonicGain);
    harmonicGain.connect(gain);
    
    harmonic.start(ctx.currentTime + 1);
    harmonic.stop(ctx.currentTime + 5);

    // Whisper-like noise burst
    playWhisper();
  } catch (e) {
    // Audio not supported or blocked
  }
}

function playWhisper(): void {
  try {
    const { ctx, gain } = getAudioContext();
    
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 5;
    
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, ctx.currentTime + 2);
    envelope.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2.2);
    envelope.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);
    
    noise.connect(filter);
    filter.connect(envelope);
    envelope.connect(gain);
    
    noise.start(ctx.currentTime + 2);
    noise.stop(ctx.currentTime + 2.5);
  } catch {
    // Audio not supported or blocked - silent fail
  }
}

export function startAmbientSound(tensionLevel: number = 0): void {
  if (isAmbientPlaying) {
    // Update tension level without restarting
    updateTensionAudio(tensionLevel);
    return;
  }
  
  try {
    const { ctx, gain } = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    isAmbientPlaying = true;
    currentTensionLevel = tensionLevel;
    
    // Deep sub-bass drone - intensity based on tension
    const subDrone = ctx.createOscillator();
    const subGain = ctx.createGain();
    const subFilter = ctx.createBiquadFilter();
    
    subDrone.type = 'sine';
    subDrone.frequency.setValueAtTime(30 - tensionLevel * 3, ctx.currentTime);
    
    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(80 + tensionLevel * 20, ctx.currentTime);
    
    subGain.gain.setValueAtTime(0, ctx.currentTime);
    subGain.gain.linearRampToValueAtTime(0.08 + tensionLevel * 0.03, ctx.currentTime + 3);
    
    subDrone.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(gain);
    subDrone.start();
    
    ambientNodes.push(subDrone);
    ambientGains.push(subGain);
    
    // Eerie mid-range oscillation - more intense at higher tension
    const eerieOsc = ctx.createOscillator();
    const eerieGain = ctx.createGain();
    const eerieFilter = ctx.createBiquadFilter();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    
    eerieOsc.type = tensionLevel >= 3 ? 'sawtooth' : 'sine';
    eerieOsc.frequency.setValueAtTime(180 - tensionLevel * 20, ctx.currentTime);
    
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.05 + tensionLevel * 0.03, ctx.currentTime);
    lfoGain.gain.setValueAtTime(15 + tensionLevel * 10, ctx.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(eerieOsc.frequency);
    
    eerieFilter.type = 'lowpass';
    eerieFilter.frequency.setValueAtTime(300 + tensionLevel * 100, ctx.currentTime);
    
    eerieGain.gain.setValueAtTime(0, ctx.currentTime);
    eerieGain.gain.linearRampToValueAtTime(0.02 + tensionLevel * 0.015, ctx.currentTime + 4);
    
    eerieOsc.connect(eerieFilter);
    eerieFilter.connect(eerieGain);
    eerieGain.connect(gain);
    
    eerieOsc.start();
    lfo.start();
    
    ambientNodes.push(eerieOsc, lfo);
    ambientGains.push(eerieGain);
    
    // Ghostly wind-like noise
    const windNoise = createWindNoise(ctx, tensionLevel);
    const windGain = ctx.createGain();
    
    windGain.gain.setValueAtTime(0, ctx.currentTime);
    windGain.gain.linearRampToValueAtTime(0.015 + tensionLevel * 0.01, ctx.currentTime + 5);
    
    windNoise.connect(windGain);
    windGain.connect(gain);
    
    ambientGains.push(windGain);
    
    // Occasional whisper sounds - more frequent at higher tension
    scheduleRandomWhispers(ctx, gain, tensionLevel);
    
    // Add heartbeat at high tension
    if (tensionLevel >= 3) {
      scheduleHeartbeat(ctx, gain, tensionLevel);
    }
    
    // Add dissonant tones at max tension
    if (tensionLevel >= 4) {
      addDissonance(ctx, gain);
    }
    
  } catch (e) {
    isAmbientPlaying = false;
  }
}

function updateTensionAudio(tensionLevel: number): void {
  if (!isAmbientPlaying || tensionLevel === currentTensionLevel) return;
  
  currentTensionLevel = tensionLevel;
  
  try {
    const { ctx, gain } = getAudioContext();
    
    // Adjust existing gains based on new tension level
    ambientGains.forEach((g, i) => {
      const baseGain = 0.02 + i * 0.01;
      const targetGain = baseGain + tensionLevel * 0.015;
      g.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 1);
    });
    
    // Add new effects for higher tension levels
    if (tensionLevel >= 3) {
      scheduleHeartbeat(ctx, gain, tensionLevel);
    }
    if (tensionLevel >= 4) {
      addDissonance(ctx, gain);
    }
  } catch {
    // Audio not supported or blocked - silent fail
  }
}

function scheduleHeartbeat(ctx: AudioContext, gain: GainNode, tensionLevel: number): void {
  if (!isAmbientPlaying) return;
  
  const bpm = 60 + tensionLevel * 20; // Faster at higher tension
  const interval = 60000 / bpm;
  
  const playBeat = () => {
    if (!isAmbientPlaying) return;
    
    // First beat (louder)
    const beat1 = ctx.createOscillator();
    const beat1Env = ctx.createGain();
    const beat1Filter = ctx.createBiquadFilter();
    
    beat1.type = 'sine';
    beat1.frequency.setValueAtTime(40, ctx.currentTime);
    beat1.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
    
    beat1Filter.type = 'lowpass';
    beat1Filter.frequency.value = 100;
    
    beat1Env.gain.setValueAtTime(0.15, ctx.currentTime);
    beat1Env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    
    beat1.connect(beat1Filter);
    beat1Filter.connect(beat1Env);
    beat1Env.connect(gain);
    beat1.start();
    beat1.stop(ctx.currentTime + 0.2);
    
    // Second beat (quieter, delayed)
    setTimeout(() => {
      if (!isAmbientPlaying) return;
      
      const beat2 = ctx.createOscillator();
      const beat2Env = ctx.createGain();
      const beat2Filter = ctx.createBiquadFilter();
      
      beat2.type = 'sine';
      beat2.frequency.setValueAtTime(35, ctx.currentTime);
      beat2.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.1);
      
      beat2Filter.type = 'lowpass';
      beat2Filter.frequency.value = 80;
      
      beat2Env.gain.setValueAtTime(0.08, ctx.currentTime);
      beat2Env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      beat2.connect(beat2Filter);
      beat2Filter.connect(beat2Env);
      beat2Env.connect(gain);
      beat2.start();
      beat2.stop(ctx.currentTime + 0.15);
    }, 150);
  };
  
  // Play immediately and schedule next
  playBeat();
  setTimeout(() => {
    if (isAmbientPlaying && currentTensionLevel >= 3) {
      scheduleHeartbeat(ctx, gain, tensionLevel);
    }
  }, interval);
}

function addDissonance(ctx: AudioContext, gain: GainNode): void {
  if (!isAmbientPlaying) return;
  
  // Dissonant chord that creates unease
  const frequencies = [55, 58.5, 82.5, 87.5]; // Minor second intervals
  
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = i % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Slight detuning for more dissonance
    const detune = (Math.random() - 0.5) * 20;
    osc.detune.setValueAtTime(detune, ctx.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    oscGain.gain.setValueAtTime(0, ctx.currentTime);
    oscGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 2);
    oscGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 5);
    oscGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 8);
    
    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 8);
  });
  
  // Schedule next dissonance
  setTimeout(() => {
    if (isAmbientPlaying && currentTensionLevel >= 4) {
      addDissonance(ctx, gain);
    }
  }, 10000 + Math.random() * 5000);
}

function createWindNoise(ctx: AudioContext, tensionLevel: number = 0): AudioNode {
  const bufferSize = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  // Generate brownian noise (wind-like) - more chaotic at higher tension
  let lastValue = 0;
  const chaosMultiplier = 0.02 + tensionLevel * 0.01;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastValue + (chaosMultiplier * white)) / 1.02;
    lastValue = data[i];
    data[i] *= 3.5 + tensionLevel;
  }
  
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 400 + tensionLevel * 100;
  filter.Q.value = 0.5 + tensionLevel * 0.3;
  
  // Modulate the filter for movement
  const filterLfo = ctx.createOscillator();
  const filterLfoGain = ctx.createGain();
  filterLfo.frequency.value = 0.1 + tensionLevel * 0.05;
  filterLfoGain.gain.value = 200 + tensionLevel * 50;
  
  filterLfo.connect(filterLfoGain);
  filterLfoGain.connect(filter.frequency);
  
  noise.connect(filter);
  noise.start();
  filterLfo.start();
  
  return filter;
}

function scheduleRandomWhispers(ctx: AudioContext, gain: GainNode, tensionLevel: number = 0): void {
  const scheduleNext = () => {
    if (!isAmbientPlaying) return;
    
    // More frequent whispers at higher tension
    const baseDelay = 8000 - tensionLevel * 1500;
    const randomRange = 15000 - tensionLevel * 2000;
    const delay = Math.max(2000, baseDelay + Math.random() * Math.max(3000, randomRange));
    
    setTimeout(() => {
      if (!isAmbientPlaying) return;
      
      // Random whisper effect - louder at higher tension
      const bufferSize = ctx.sampleRate * (0.3 + Math.random() * 0.4 + tensionLevel * 0.1);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (0.1 + tensionLevel * 0.03);
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600 + Math.random() * 600 - tensionLevel * 100;
      filter.Q.value = 3 + Math.random() * 5 + tensionLevel;
      
      const envelope = ctx.createGain();
      const peakGain = 0.025 + tensionLevel * 0.015;
      envelope.gain.setValueAtTime(0, ctx.currentTime);
      envelope.gain.linearRampToValueAtTime(peakGain, ctx.currentTime + 0.1);
      envelope.gain.linearRampToValueAtTime(peakGain * 0.6, ctx.currentTime + 0.2);
      envelope.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4 + tensionLevel * 0.1);
      
      noise.connect(filter);
      filter.connect(envelope);
      envelope.connect(gain);
      
      noise.start();
      noise.stop(ctx.currentTime + 0.5 + tensionLevel * 0.1);
      
      scheduleNext();
    }, delay);
  };
  
  scheduleNext();
}

export function stopAmbientSound(): void {
  if (!isAmbientPlaying) return;
  
  try {
    const { ctx } = getAudioContext();
    
    // Fade out all ambient gains
    ambientGains.forEach((g) => {
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    });
    
    // Stop oscillators after fade
    setTimeout(() => {
      ambientNodes.forEach((node) => {
        try {
          node.stop();
        } catch {
          // Node already stopped - silent fail
        }
      });
      ambientNodes = [];
      ambientGains = [];
    }, 2100);
    
    isAmbientPlaying = false;
  } catch {
    // Audio not supported or blocked - silent fail
  }
}

export function isAmbientActive(): boolean {
  return isAmbientPlaying;
}

export function playEntityResponse(): void {
  try {
    const { ctx, gain } = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    // Creepy arrival sound
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const env = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(80, ctx.currentTime);
    osc1.frequency.linearRampToValueAtTime(60, ctx.currentTime + 1);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(82, ctx.currentTime);
    osc2.frequency.linearRampToValueAtTime(58, ctx.currentTime + 1);
    
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.3);
    env.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.8);
    env.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(env);
    env.connect(gain);
    
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 1.5);
    osc2.stop(ctx.currentTime + 1.5);
  } catch {
    // Audio not supported or blocked - silent fail
  }
}

export function playLetterSound(charIndex: number): void {
  try {
    const { ctx, gain } = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    // Wooden creak with pitch variation
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    const baseFreq = 400 + (charIndex % 5) * 50;
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, ctx.currentTime + 0.08);
    
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    
    env.gain.setValueAtTime(0.12, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.connect(filter);
    filter.connect(env);
    env.connect(gain);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Audio not supported or blocked - silent fail
  }
}
