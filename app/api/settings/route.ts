import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const body = await request.json();
  if (body.handedness !== "left" && body.handedness !== "right") {
    return Response.json({ error: "Invalid handedness value" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { handedness: body.handedness },
  });

  return Response.json({ success: true });
}