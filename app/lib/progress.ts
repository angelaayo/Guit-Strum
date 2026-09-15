import type { Chord, ChordMastery } from "@/app/generated/prisma/client";
type ChordWithMastery = Chord & { mastery: ChordMastery[] };

export function getAccuracy(mastery: ChordMastery | undefined): number | null {
  if (!mastery) return null;
  const attempts = mastery.correctAttempts + mastery.incorrectAttempts;
  if (attempts === 0) return null;
  return mastery.correctAttempts / attempts;
}

export function getRecommendedChord(
  chords: ChordWithMastery[],
): ChordWithMastery {
  const neverPracticed = chords.filter((c) => c.mastery.length === 0);
  if (neverPracticed.length > 0) {
    return neverPracticed[0];
  }

  return [...chords].sort((a, b) => {
    const accA = getAccuracy(a.mastery[0]) ?? 0;
    const accB = getAccuracy(b.mastery[0]) ?? 0;
    if (accA !== accB) return accA - accB;

    const dateA = a.mastery[0]?.lastPracticedAt?.getTime() ?? 0;
    const dateB = b.mastery[0]?.lastPracticedAt?.getTime() ?? 0;
    return dateA - dateB;
  })[0];
}

export function getOverallStats(chords: ChordWithMastery[]) {
  const practiced = chords.filter((c) => c.mastery.length > 0);
  const totalCorrect = chords.reduce(
    (sum, c) => sum + (c.mastery[0]?.correctAttempts ?? 0),
    0,
  );
  const totalIncorrect = chords.reduce(
    (sum, c) => sum + (c.mastery[0]?.incorrectAttempts ?? 0),
    0,
  );
  const totalAttempts = totalCorrect + totalIncorrect;

  const mastered = chords.filter((c) => {
    const acc = getAccuracy(c.mastery[0]);
    const attempts =
      (c.mastery[0]?.correctAttempts ?? 0) +
      (c.mastery[0]?.incorrectAttempts ?? 0);
    return acc !== null && acc >= 0.85 && attempts >= 10;
  });

  return {
    chordsTried: practiced.length,
    totalChords: chords.length,
    overallAccuracy: totalAttempts > 0 ? totalCorrect / totalAttempts : null,
    masteredCount: mastered.length,
  };
}
