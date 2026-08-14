const NOTE_NAMES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];

export type Pitch = { frequency: number; midi: number; note: string; cents: number };

export function frequencyToPitch(frequency: number): Pitch {
  const exactMidi = 69 + 12 * Math.log2(frequency / 440);
  const midi = Math.round(exactMidi);
  return { frequency, midi, note: `${NOTE_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`, cents: Math.round((exactMidi - midi) * 100) };
}

// YIN-style difference function with cumulative mean normalization.
export function detectPitch(buffer: Float32Array, sampleRate: number): number | null {
  let rms = 0;
  for (const sample of buffer) rms += sample * sample;
  if (Math.sqrt(rms / buffer.length) < 0.012) return null;
  const minLag = Math.floor(sampleRate / 500);
  const maxLag = Math.min(Math.floor(sampleRate / 55), Math.floor(buffer.length / 2));
  const yin = new Float32Array(maxLag + 1);
  for (let lag = 1; lag <= maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i < buffer.length - lag; i++) {
      const delta = buffer[i] - buffer[i + lag];
      sum += delta * delta;
    }
    yin[lag] = sum;
  }
  let running = 0;
  yin[0] = 1;
  for (let lag = 1; lag <= maxLag; lag++) {
    running += yin[lag];
    yin[lag] = running ? (yin[lag] * lag) / running : 1;
  }
  let best = -1;
  for (let lag = minLag; lag < maxLag; lag++) {
    if (yin[lag] < 0.14 && yin[lag] <= yin[lag - 1] && yin[lag] < yin[lag + 1]) { best = lag; break; }
  }
  if (best < 0) return null;
  const left = yin[best - 1], center = yin[best], right = yin[best + 1];
  const correction = (left - right) / (2 * (left - 2 * center + right) || 1);
  const frequency = sampleRate / (best + correction);
  return frequency >= 55 && frequency <= 500 ? frequency : null;
}
