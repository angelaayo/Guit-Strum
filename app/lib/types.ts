export type ChordDifficulty = "beginner" | "intermediate" | "advanced";
export interface Chord{
    id: string;
    name: string;
    family: string;
    difficulty: ChordDifficulty;
    frets: number[];
    fingers?: number[];
    isBarre?: boolean;
    barreFret?: number;
    barreRange?: [number, number];
    audioUrl?: string;

}

export interface GameAttempt{
    chordId: string;
    correct: boolean;
    timestamp: number;
}

export interface GameMode {
  id: string;
  label: string;
  tagline: string;
  description: string;
  chords: Chord[];
}

