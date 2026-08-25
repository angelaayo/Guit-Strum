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
    audioUrl?: string;
}

export interface GameAttempt{
    chordId: string;
    correct: boolean;
    timestamp: number;
}