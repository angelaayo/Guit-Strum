import { describe, it, expect } from "vitest";
import { getRandomChord, getModeById, gameModes } from "./chords";
import type { Chord } from "@/app/generated/prisma/client";

const pool = [
  { id: "a", family: "G" },
  { id: "b", family: "Am" },
  { id: "c", family: "C" },
] as Chord[];

describe("getRandomChord", () => {
  it("always returns something from the given pool", () => {
    for (let i = 0; i < 50; i++) {
      const result = getRandomChord(pool);
      expect(pool.map((c) => c.id)).toContain(result.id);
    }
  });

  it("never returns the excluded id when alternatives exist", () => {
    for (let i = 0; i < 50; i++) {
      const result = getRandomChord(pool, "a");
      expect(result.id).not.toBe("a");
    }
  });

  it("falls back to the full pool if excluding would leave nothing", () => {
    const single = [{ id: "only", family: "G" }] as Chord[];
    const result = getRandomChord(single, "only");
    expect(result.id).toBe("only");
  });
});

describe("getModeById", () => {
  it("finds an existing mode", () => {
    expect(getModeById("beginner")?.label).toBe("Beginner");
  });

  it("returns undefined for an unknown id", () => {
    expect(getModeById("not-a-real-mode")).toBeUndefined();
  });
});

describe("gameModes", () => {
  it("has exactly one mode with no difficulty filter (the 'all' mode)", () => {
    const unfiltered = gameModes.filter((m) => !m.difficulties);
    expect(unfiltered).toHaveLength(1);
  });
});
