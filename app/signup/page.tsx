"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupInput } from "@/app/lib/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import MusicIconOrbit from "@/app/components/MusicIconOrbit";

const features = [
  "Live chord recognition — play a real chord, get instant feedback through your mic",
  "Practice modes for every stage, from open chords to barre chords",
  "A chord library you can browse and study at your own pace",
];

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(data: SignupInput) {
    setServerError("");
    const res = await fetch("/api/signup", {
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
      className="min-h-screen w-full flex flex-col lg:flex-row"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Left panel — icon mark + pitch */}
      <div className="lg:w-1/2 relative flex flex-col items-center justify-center px-6 py-16 sm:px-8">
        <Link
          href="/"
          className="absolute top-6 left-6 font-inter text-sm"
          style={{ color: "var(--color-muted)" }}
        >
          ← Back to GuitStrum
        </Link>

        <div className="flex flex-col items-center text-center max-w-md gap-1">
          <MusicIconOrbit size="md" className="mb-8" />

          <h1
            className="font-source-serif text-2xl sm:text-3xl font-semibold mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            Learn chords by actually playing them
          </h1>
          <p
            className="font-inter text-sm mb-6"
            style={{ color: "var(--color-muted)" }}
          >
            GuitStrum listens while you play and tells you if you got the chord
            right — no guessing, no waiting for feedback.
          </p>

          <ul className="flex flex-col gap-3 text-left">
            {features.map((feature) => (
              <li
                key={feature}
                className="font-inter text-sm flex gap-2"
                style={{ color: "var(--color-primary)" }}
              >
                <span>—</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="lg:w-1/2 flex items-center justify-center px-4 py-10 sm:px-6">
        <div
          className="w-full max-w-sm rounded-2xl border p-6 sm:p-8"
          style={{
            backgroundColor: "var(--color-card-bg)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2
            className="font-source-serif text-2xl font-semibold mb-1"
            style={{ color: "var(--color-primary)" }}
          >
            Create your account
          </h2>
          <p
            className="font-inter text-sm mb-6"
            style={{ color: "var(--color-muted)" }}
          >
            Free, and takes about a minute.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-muted)" }}
                />
                <input
                  {...register("displayName")}
                  type="text"
                  placeholder="Display name"
                  className="gs-input w-full border rounded-xl pl-11 pr-4 py-3 font-inter text-sm"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-bg)",
                  }}
                />
              </div>
              {errors.displayName && (
                <p
                  className="font-inter text-xs mt-1"
                  style={{ color: "var(--color-muted-string)" }}
                >
                  {errors.displayName.message}
                </p>
              )}
            </div>

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
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p
            className="font-inter text-sm mt-6"
            style={{ color: "var(--color-muted)" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
