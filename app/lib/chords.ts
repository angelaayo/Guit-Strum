import { Chord } from "./types";

export const chords: Chord[] = [
  {
    id: "g-major-open",
    name: "G Major",
    family: "G",
    difficulty: "beginner",
    frets: [3, 2, 0, 0, 0, 3],
  },
  {
    id: "a-minor-open",
    name: "A Minor",
    family: "Am",
    difficulty: "beginner",
    frets: [-1, 0, 2, 2, 1, 0],
  },
  {
    id: "bb-major-barre",
    name: "Bb Major",
    family: "Bb",
    difficulty: "intermediate",
    frets: [-1, 1, 3, 3, 3, 1],
    isBarre: true,
    barreFret: 1,
  },
  {
    id: "c-major-open",
    name: "C Major",
    family: "C",
    difficulty: "beginner",
    frets: [3, 2, 0, 0, 0, 3],
  },
  {
    id: "f-major-barre",
    name: "F Major",
    family: "F",
    difficulty: "advanced",
    frets: [1, 3, 3, 2, 1, 1],
    isBarre: true,
    barreFret: 1,
    barreRange: [0, 5],
  },
  {
    id: "d-minor-open",
    name: "D Minor",
    family: "Dm",
    difficulty: "beginner",
    frets: [-1, -1, 0, 2, 3, 1],
  },
  {
    id: "e-minor-open",
    name: "E Minor",
    family: "Em",
    difficulty: "beginner",
    frets: [0, 2, 2, 0, 0, 0],
  },
  {
    id: "b-diminished",
    name: "B Diminished",
    family: "Bdim",
    difficulty: "advanced",
    frets: [-1, 2, 3, 4, 3, -1],
  },
];

export function getRandomChord(): Chord{
  const index = Math.floor(Math.random() * chords.length);
  return chords[index]
}
