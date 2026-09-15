import Link from "next/link";
import { Lock } from "lucide-react";

export default function LockedFeature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 gap-6">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "var(--color-card-bg)" }}
      >
        <Lock size={28} style={{ color: "var(--color-primary)" }} />
      </div>

      <div className="text-center max-w-sm">
        <h1
          className="font-source-serif text-2xl font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          {title}
        </h1>
        <p
          className="font-inter text-sm mt-2"
          style={{ color: "var(--color-muted)" }}
        >
          {description}
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/signup"
          className="gs-button font-source-serif font-semibold rounded-xl px-6 py-3"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-bg)",
          }}
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="font-source-serif font-semibold rounded-xl px-6 py-3 border"
          style={{
            color: "var(--color-primary)",
            borderColor: "var(--color-border)",
          }}
        >
          Log In
        </Link>
      </div>

      <Link
        href="/play"
        className="font-inter text-sm"
        style={{ color: "var(--color-muted)" }}
      >
        Or just start playing without an account →
      </Link>
    </div>
  );
}
