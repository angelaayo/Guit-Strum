import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ skipped: true });
  }

  const { chordId, correct } = await request.json();
  if (typeof chordId !== "string" || typeof correct !== "boolean") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    await prisma.chordMastery.upsert({
      where: { userId_chordId: { userId: user.id, chordId } },
      create: {
        userId: user.id,
        chordId,
        correctAttempts: correct ? 1 : 0,
        incorrectAttempts: correct ? 0 : 1,
        lastPracticedAt: new Date(),
      },
      update: {
        correctAttempts: correct ? { increment: 1 } : undefined,
        incorrectAttempts: correct ? undefined : { increment: 1 },
        lastPracticedAt: new Date(),
      },
    });
    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return Response.json({ error: "Unknown chord" }, { status: 400 });
    }
    console.error("Mastery upsert failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}