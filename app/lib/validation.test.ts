import { describe, it, expect } from "vitest";
import { signupSchema, loginSchema } from "./validation";

describe("signupSchema", () => {
  it("accepts valid input", () => {
    const result = signupSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      displayName: "Angela",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing display name", () => {
    const result = signupSchema.safeParse({ email: "test@example.com", password: "password123" });
    expect(result.success).toBe(false);
  });

  it("rejects a password under 8 characters", () => {
    const result = signupSchema.safeParse({
      email: "test@example.com",
      password: "short",
      displayName: "Angela",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("does not require a display name", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "x" });
    expect(result.success).toBe(true);
  });
});