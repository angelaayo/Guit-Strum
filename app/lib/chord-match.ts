// Turns the recognizer's detected notes into a match against a target chord's
// fret shape. The recognizer sends an 88-length activation array where index i
// corresponds to MIDI note 21 + i (A0). The chord decision is made on pitch
// classes (octave-robust); per-string results keep exact octaves for feedback.

// Open-string MIDI notes for standard tuning, low-E to high-E (E A D G B E).
export const STANDARD_TUNING = [40, 45, 50, 55, 59, 64];

// The recognizer's note profile starts at MIDI 21 (A0).
const NOTE_BASE_MIDI = 21;

// How strong a note must be to count as "held" on its string. SVM-era value is
// gone; this is a first guess to be tuned against real recordings.
const PER_STRING_FLOOR = 0.1;

export interface StringResult {
  stringIndex: number; // 0 = low E ... 5 = high E
  expected: number | null; // expected MIDI note, or null if the string is muted
  strength: number; // detected activation at that exact note (0 if absent)
  held: boolean; // strength is above PER_STRING_FLOOR
}

export interface ChordMatch {
  score: number; // 0..1 cosine similarity of detected notes to the target chord
  strings: StringResult[];
}

/** Expected MIDI note for each strummed string; muted strings (fret < 0) are omitted. */
export function fretsToNotes(frets: number[]): number[] {
  const notes: number[] = [];
  for (let i = 0; i < frets.length; i++) {
    if (frets[i] < 0) continue; // muted string
    notes.push(STANDARD_TUNING[i] + frets[i]);
  }
  return notes;
}

/** Activation of a specific MIDI note in the 88-length profile (0 if out of range). */
function activationAt(notes: number[], midi: number): number {
  const idx = midi - NOTE_BASE_MIDI;
  return idx >= 0 && idx < notes.length ? notes[idx] : 0;
}

/** Fold the 88-note profile into a 12-bin pitch-class vector (0 = C). */
function pitchClassProfile(notes: number[]): number[] {
  const pc = new Array(12).fill(0);
  for (let i = 0; i < notes.length; i++) {
    pc[(NOTE_BASE_MIDI + i) % 12] += notes[i];
  }
  return pc;
}

/** Cosine similarity of two equal-length vectors; 0 if either is all-zero. */
function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/**
 * Score how well a detected note profile matches a target chord's fret shape.
 * `notes` is the recognizer's 88-length activation array (index i -> MIDI 21 + i).
 * `frets` is the chord's per-string fret array (6 strings, -1 = muted).
 */
export function matchChord(notes: number[], frets: number[]): ChordMatch {
  const expectedNotes = fretsToNotes(frets);

  // Chord decision: cosine over pitch classes, which is robust to the octave
  // errors Basic Pitch makes on the higher strings.
  const detectedPC = pitchClassProfile(notes);
  const targetPC = new Array(12).fill(0);
  for (const midi of expectedNotes) targetPC[midi % 12] = 1;
  const score = cosine(detectedPC, targetPC);

  // Per-string feedback uses exact-octave activation. This is the flaky part
  // (octave confusion), so it is reported but does not gate correctness.
  const strings: StringResult[] = frets.map((fret, i) => {
    if (fret < 0) {
      return { stringIndex: i, expected: null, strength: 0, held: false };
    }
    const midi = STANDARD_TUNING[i] + fret;
    const strength = activationAt(notes, midi);
    return { stringIndex: i, expected: midi, strength, held: strength >= PER_STRING_FLOOR };
  });

  return { score, strings };
}
