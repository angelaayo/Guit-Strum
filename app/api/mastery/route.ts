import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ skipped: true });
  }

  const { chordId, correct } = await request.json();
  if (typeof chordId !== "string" || typeof correct !== "boolean") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

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
}
