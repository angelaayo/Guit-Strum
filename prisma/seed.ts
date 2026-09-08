import { prisma } from "@/app/lib/prisma";

// Chord shapes are stored in canonical right-handed string order:
// low E, A, D, G, B, high E. The diagram component will reverse these
// values for a left-handed user's display.
const chords = [
  {
    id: "g-major-open",
    name: "G Major",
    family: "G",
    difficulty: "beginner" as const,
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [],
    isBarre: false,
    barreFret: null,
    barreStart: null,
    barreEnd: null,
  },
  {
    id: "a-minor-open",
    name: "A Minor",
    family: "Am",
    difficulty: "beginner" as const,
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [],
    isBarre: false,
    barreFret: null,
    barreStart: null,
    barreEnd: null,
  },
  {
    id: "bb-major-barre",
    name: "Bb Major",
    family: "Bb",
    difficulty: "intermediate" as const,
    frets: [-1, 1, 3, 3, 3, 1],
    fingers: [],
    isBarre: true,
    barreFret: 1,
    barreStart: null,
    barreEnd: null,
  },
  {
    id: "c-major-open",
    name: "C Major",
    family: "C",
    difficulty: "beginner" as const,
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [],
    isBarre: false,
    barreFret: null,
    barreStart: null,
    barreEnd: null,
  },
  {
    id: "f-major-barre",
    name: "F Major",
    family: "F",
    difficulty: "advanced" as const,
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [],
    isBarre: true,
    barreFret: 1,
    barreStart: 0,
    barreEnd: 5,
  },
  {
    id: "d-minor-open",
    name: "D Minor",
    family: "Dm",
    difficulty: "beginner" as const,
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [],
    isBarre: false,
    barreFret: null,
    barreStart: null,
    barreEnd: null,
  },
  {
    id: "e-minor-open",
    name: "E Minor",
    family: "Em",
    difficulty: "beginner" as const,
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [],
    isBarre: false,
    barreFret: null,
    barreStart: null,
    barreEnd: null,
  },
  {
    id: "b-diminished",
    name: "B Diminished",
    family: "Bdim",
    difficulty: "advanced" as const,
    frets: [-1, 2, 3, 4, 3, -1],
    fingers: [],
    isBarre: false,
    barreFret: null,
    barreStart: null,
    barreEnd: null,
  },
];

async function main() {
  for (const chord of chords) {
    const { id, ...data } = chord;

    await prisma.chord.upsert({
      where: { id },
      update: data,
      create: chord,
    });
  }

  console.log(`Seeded ${chords.length} chords.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
