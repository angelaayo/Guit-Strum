import { prisma } from "@/app/lib/prisma";
import { GameMode } from "./types";

export async function getAllChords() {
  return prisma.chord.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getChordsForMode(mode: GameMode) {
  return prisma.chord.findMany({
    where: mode.difficulties
      ? { difficulty: { in: mode.difficulties } }
      : undefined,
  });
}
