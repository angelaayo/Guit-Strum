import { prisma } from "@/app/lib/prisma";
import { hashPassword, signToken, setSessionCookie } from "@/app/lib/auth";
import { signupSchema } from "@/app/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const result = signupSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { error: result.error.issues[0].message },
      { status: 400 },
    );
  }

  const { email, password, displayName } = result.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json(
      { error: "An account with this email already exists" },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, displayName },
  });

  const token = await signToken(user.id);
  await setSessionCookie(token);

  return Response.json({
    user: { id: user.id, email: user.email, displayName: user.displayName },
  });
}
