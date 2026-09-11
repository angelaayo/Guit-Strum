import { prisma } from "@/app/lib/prisma";
import { verifyPassword, signToken, setSessionCookie } from "@/app/lib/auth";
import { loginSchema } from "@/app/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { error: result.error.issues[0].message },
      { status: 400 },
    );
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return Response.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return Response.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const token = await signToken(user.id);
  await setSessionCookie(token);

  return Response.json({
    user: { id: user.id, email: user.email, displayName: user.displayName },
  });
}
