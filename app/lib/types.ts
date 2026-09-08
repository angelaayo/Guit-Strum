export type ChordDifficulty = "beginner" | "intermediate" | "advanced";

export interface GameAttempt {
  chordId: string;
  correct: boolean;
  timestamp: number;
}

export interface GameMode {
  id: string;
  label: string;
  tagline: string;
  description: string;
  difficulties?: ChordDifficulty[];
}
