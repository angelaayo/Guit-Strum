import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

const mockGetCurrentUser = vi.fn();
const mockUpsert = vi.fn();

vi.mock("@/app/lib/auth", () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}));

vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    chordMastery: {
      upsert: (...args: unknown[]) => mockUpsert(...args),
    },
  },
}));

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/mastery", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/mastery", () => {
  it("no-ops for anonymous users without touching the database", async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const res = await POST(
      makeRequest({ chordId: "g-major-open", correct: true }),
    );
    const json = await res.json();

    expect(json).toEqual({ skipped: true });
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it("rejects a payload with the wrong types", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" });

    const res = await POST(makeRequest({ chordId: 123, correct: "yes" }));
    expect(res.status).toBe(400);
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it("upserts with incrementing correctAttempts on a correct attempt", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" });
    mockUpsert.mockResolvedValue({});

    const res = await POST(
      makeRequest({ chordId: "g-major-open", correct: true }),
    );

    expect(res.status).toBe(200);
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_chordId: { userId: "user-1", chordId: "g-major-open" },
        },
        update: expect.objectContaining({
          correctAttempts: { increment: 1 },
          incorrectAttempts: undefined,
        }),
      }),
    );
  });

  it("returns a clean 400 on a foreign key violation instead of a raw 500", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" });
    const fkError = Object.assign(new Error("FK violation"), { code: "P2003" });
    Object.setPrototypeOf(
      fkError,
      (await import("@/app/generated/prisma/client")).Prisma
        .PrismaClientKnownRequestError.prototype,
    );
    mockUpsert.mockRejectedValue(fkError);

    const res = await POST(
      makeRequest({ chordId: "not-a-real-chord", correct: true }),
    );
    expect(res.status).toBe(400);
  });
});
