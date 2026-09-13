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

export async function getChordById(id: string) {
  return prisma.chord.findUnique({ where: { id } });
}

export async function getMasteryForUser(userId: string, chordId: string) {
  return prisma.chordMastery.findUnique({
    where: { userId_chordId: { userId, chordId } },
  });
}
