"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupInput } from "@/app/lib/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

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

    router.push("/"); // logged in, send them to the app
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-80"
      >
        <h1
          className="font-source-serif text-2xl font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          Create your account
        </h1>

        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg px-3 py-2"
            style={{ borderColor: "var(--color-border)" }}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2"
            style={{ borderColor: "var(--color-border)" }}
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <input
            {...register("displayName")}
            type="text"
            placeholder="Display name (optional)"
            className="w-full border rounded-lg px-3 py-2"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="font-semibold rounded-lg px-4 py-2"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-bg)",
          }}
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
