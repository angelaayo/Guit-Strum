import { clearSessionCookie } from "@/app/lib/auth";

export async function POST() {
  await clearSessionCookie();
  return Response.json({ success: true });
}