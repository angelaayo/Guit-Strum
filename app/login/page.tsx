"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/app/lib/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import MusicIconOrbit from "@/app/components/MusicIconOrbit";
import FormField from "@/app/components/FormField";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      setServerError(result.error);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* decorative background rings, echoing the orbit motif at scale */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[560px] h-[560px] rounded-full border border-dashed"
          style={{ borderColor: "var(--color-border)", opacity: 0.5 }}
        />
        <div
          className="absolute w-[380px] h-[380px] rounded-full border border-dashed"
          style={{ borderColor: "var(--color-border)", opacity: 0.7 }}
        />
      </div>

      <Link
        href="/play"
        className="absolute top-6 left-6 font-inter text-sm z-10"
        style={{ color: "var(--color-muted)" }}
      >
        ← Back to GuitStrum
      </Link>

      <div
        className="relative z-10 w-full max-w-md rounded-2xl border p-8 sm:p-10 flex flex-col items-center gap-6 shadow-sm"
        style={{
          backgroundColor: "var(--color-card-bg)",
          borderColor: "var(--color-border)",
        }}
      >
        <MusicIconOrbit size="sm" />

        <div className="text-center">
          <h1
            className="font-source-serif text-3xl font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            Welcome back
          </h1>
          <p
            className="font-inter text-sm mt-2"
            style={{ color: "var(--color-muted)" }}
          >
            Pick up your practice where you left off.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          <FormField
            label="Email"
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            registration={register("email")}
            error={errors.email?.message}
          />
          <FormField
            label="Password"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            registration={register("password")}
            error={errors.password?.message}
          />

          {serverError && (
            <p
              className="font-inter text-xs"
              style={{ color: "var(--color-muted-string)" }}
            >
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="gs-button font-source-serif font-semibold rounded-xl px-4 py-3.5 mt-2"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-bg)",
            }}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p
          className="font-inter text-sm"
          style={{ color: "var(--color-muted)" }}
        >
          No account?{" "}
          <Link
            href="/signup"
            className="font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
