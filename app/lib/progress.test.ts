import { describe, it, expect } from "vitest";
import { getAccuracy, getRecommendedChord, getOverallStats } from "./progress";
import type { Chord, ChordMastery } from "@/app/generated/prisma/client";

type ChordWithMastery = Chord & { mastery: ChordMastery[] };

function makeChord(overrides: Partial<Chord> = {}): Chord {
  return {
    id: "g-major-open",
    name: "G Major",
    family: "G",
    difficulty: "beginner",
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [],
    isBarre: false,
    barreFret: null,
    barreStart: null,
    barreEnd: null,
    ...overrides,
  } as Chord;
}

function makeMastery(overrides: Partial<ChordMastery> = {}): ChordMastery {
  return {
    userId: "user-1",
    chordId: "g-major-open",
    correctAttempts: 0,
    incorrectAttempts: 0,
    lastPracticedAt: new Date(),
    ...overrides,
  } as ChordMastery;
}

function makeChordWithMastery(
  chordOverrides: Partial<Chord>,
  mastery: ChordMastery[],
): ChordWithMastery {
  return { ...makeChord(chordOverrides), mastery };
}

describe("getAccuracy", () => {
  it("returns null when there's no mastery record", () => {
    expect(getAccuracy(undefined)).toBeNull();
  });

  it("returns null when there are zero attempts", () => {
    expect(
      getAccuracy(makeMastery({ correctAttempts: 0, incorrectAttempts: 0 })),
    ).toBeNull();
  });

  it("computes the correct ratio", () => {
    const mastery = makeMastery({ correctAttempts: 3, incorrectAttempts: 1 });
    expect(getAccuracy(mastery)).toBe(0.75);
  });
});

describe("getRecommendedChord", () => {
  it("prioritizes a never-practiced chord over a practiced one", () => {
    const practiced = makeChordWithMastery({ id: "c-major-open" }, [
      makeMastery({ chordId: "c-major-open", correctAttempts: 10 }),
    ]);
    const unpracticed = makeChordWithMastery({ id: "a-minor-open" }, []);

    const result = getRecommendedChord([practiced, unpracticed]);
    expect(result.id).toBe("a-minor-open");
  });

  it("once everything's been tried, recommends the lowest-accuracy chord", () => {
    const strong = makeChordWithMastery({ id: "c-major-open" }, [
      makeMastery({
        chordId: "c-major-open",
        correctAttempts: 9,
        incorrectAttempts: 1,
      }),
    ]);
    const weak = makeChordWithMastery({ id: "f-major-barre" }, [
      makeMastery({
        chordId: "f-major-barre",
        correctAttempts: 1,
        incorrectAttempts: 9,
      }),
    ]);

    const result = getRecommendedChord([strong, weak]);
    expect(result.id).toBe("f-major-barre");
  });
});

describe("getOverallStats", () => {
  it("only counts a chord as mastered above the accuracy AND attempt-count floor", () => {
    const highAccuracyLowAttempts = makeChordWithMastery(
      { id: "a" },
      [makeMastery({ chordId: "a", correctAttempts: 1, incorrectAttempts: 0 })]
    );
    const genuinelyMastered = makeChordWithMastery(
      { id: "b" },
      [makeMastery({ chordId: "b", correctAttempts: 9, incorrectAttempts: 1 })]
    );

    const stats = getOverallStats([highAccuracyLowAttempts, genuinelyMastered]);
    expect(stats.masteredCount).toBe(1);
  });
});
