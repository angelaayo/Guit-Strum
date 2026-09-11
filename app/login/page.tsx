"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/app/lib/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import MusicIconOrbit from "@/app/components/MusicIconOrbit";

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
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <Link
        href="/"
        className="absolute top-6 left-6 font-inter text-sm"
        style={{ color: "var(--color-muted)" }}
      >
        ← Back to GuitStrum
      </Link>

      <div
        className="w-full max-w-sm rounded-2xl border p-6 sm:p-8 flex flex-col items-center gap-6"
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
          <div>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-muted)" }}
              />
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="gs-input w-full border rounded-xl pl-11 pr-4 py-3 font-inter text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                }}
              />
            </div>
            {errors.email && (
              <p
                className="font-inter text-xs mt-1"
                style={{ color: "var(--color-muted-string)" }}
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-muted)" }}
              />
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="gs-input w-full border rounded-xl pl-11 pr-4 py-3 font-inter text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                }}
              />
            </div>
            {errors.password && (
              <p
                className="font-inter text-xs mt-1"
                style={{ color: "var(--color-muted-string)" }}
              >
                {errors.password.message}
              </p>
            )}
          </div>

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
            className="gs-button font-source-serif font-semibold rounded-xl px-4 py-3 mt-2"
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
