import { describe, it, expect } from "vitest";
import { fretsToNotes, matchChord, STANDARD_TUNING } from "./chord-match";

// Build an 88-length profile (index i -> MIDI 21 + i) with the given MIDI notes
// set to `strength`, everything else 0 — stands in for the recognizer's output.
function profileFromNotes(midis: number[], strength = 1): number[] {
  const arr = new Array(88).fill(0);
  for (const m of midis) arr[m - 21] = strength;
  return arr;
}

// Open-position fret shapes (low-E to high-E, -1 = muted), from the app's seed.
const C_MAJOR = [-1, 3, 2, 0, 1, 0]; // C3 E3 G3 C4 E4
const G_MAJOR = [3, 2, 0, 0, 0, 3]; // G2 B2 D3 G3 B3 G4
const A_MINOR = [-1, 0, 2, 2, 1, 0]; // A2 E3 A3 C4 E4

describe("fretsToNotes", () => {
  it("derives the exact MIDI notes for C major open", () => {
    expect(fretsToNotes(C_MAJOR)).toEqual([48, 52, 55, 60, 64]);
  });

  it("omits muted strings", () => {
    const notes = fretsToNotes(C_MAJOR);
    expect(notes).toHaveLength(5); // 6 strings, low E muted
  });

  it("handles a chord with no muted strings (G major)", () => {
    expect(fretsToNotes(G_MAJOR)).toEqual([43, 47, 50, 55, 59, 67]);
  });

  it("uses standard tuning open strings when every fret is 0", () => {
    expect(fretsToNotes([0, 0, 0, 0, 0, 0])).toEqual(STANDARD_TUNING);
  });
});

describe("matchChord — chord decision", () => {
  it("scores a clean C-major profile high against C major", () => {
    const profile = profileFromNotes([48, 52, 55, 60, 64]); // C3 E3 G3 C4 E4
    const { score } = matchChord(profile, C_MAJOR);
    expect(score).toBeGreaterThan(0.9);
  });

  it("scores the same profile much lower against a different chord (G)", () => {
    const profile = profileFromNotes([48, 52, 55, 60, 64]);
    const cScore = matchChord(profile, C_MAJOR).score;
    const gScore = matchChord(profile, G_MAJOR).score;
    expect(gScore).toBeLessThan(cScore);
    expect(gScore).toBeLessThan(0.5);
  });

  it("distinguishes C major from A minor despite shared C and E", () => {
    const cProfile = profileFromNotes([48, 52, 55, 60, 64]); // C E G
    expect(matchChord(cProfile, C_MAJOR).score).toBeGreaterThan(
      matchChord(cProfile, A_MINOR).score,
    );
  });

  it("returns 0 for silence (all-zero profile) instead of NaN", () => {
    const { score } = matchChord(new Array(88).fill(0), C_MAJOR);
    expect(score).toBe(0);
  });
});

describe("matchChord — per-string feedback", () => {
  it("marks every played string held when all notes are present", () => {
    const profile = profileFromNotes([48, 52, 55, 60, 64]);
    const { strings } = matchChord(profile, C_MAJOR);
    const played = strings.filter((s) => s.expected !== null);
    expect(played.every((s) => s.held)).toBe(true);
  });

  it("reports the muted low-E string as expected: null, not held", () => {
    const profile = profileFromNotes([48, 52, 55, 60, 64]);
    const { strings } = matchChord(profile, C_MAJOR);
    expect(strings[0].expected).toBeNull();
    expect(strings[0].held).toBe(false);
  });

  it("flags the one specific string whose note is missing (G string silent)", () => {
    // Everything but G3 (the open G string in C major, string index 3).
    const profile = profileFromNotes([48, 52, 60, 64]);
    const { strings } = matchChord(profile, C_MAJOR);
    const gString = strings[3];
    expect(gString.expected).toBe(55); // G3
    expect(gString.held).toBe(false);
    // the other played strings are still fine
    expect(strings[1].held && strings[2].held && strings[4].held && strings[5].held).toBe(true);
  });
});
