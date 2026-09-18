import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

const mockFindUnique = vi.fn();
const mockVerifyPassword = vi.fn();
const mockSignToken = vi.fn();
const mockSetSessionCookie = vi.fn();

vi.mock("@/app/lib/prisma", () => ({
  prisma: { user: { findUnique: (...args: unknown[]) => mockFindUnique(...args) } },
}));

vi.mock("@/app/lib/auth", () => ({
  verifyPassword: (...args: unknown[]) => mockVerifyPassword(...args),
  signToken: (...args: unknown[]) => mockSignToken(...args),
  setSessionCookie: (...args: unknown[]) => mockSetSessionCookie(...args),
}));

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/login", () => {
  it("rejects an invalid email before touching the database", async () => {
    const res = await POST(makeRequest({ email: "not-an-email", password: "x" }));
    expect(res.status).toBe(400);
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it("returns the same generic error when no user exists", async () => {
    mockFindUnique.mockResolvedValue(null);

    const res = await POST(makeRequest({ email: "nobody@example.com", password: "password123" }));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Invalid email or password");
    expect(mockVerifyPassword).not.toHaveBeenCalled();
  });

  it("returns the same generic error when the password is wrong", async () => {
    mockFindUnique.mockResolvedValue({ id: "user-1", email: "real@example.com", passwordHash: "hash" });
    mockVerifyPassword.mockResolvedValue(false);

    const res = await POST(makeRequest({ email: "real@example.com", password: "wrongpass" }));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Invalid email or password");
  });

  it("signs a token and sets a cookie on valid credentials", async () => {
    mockFindUnique.mockResolvedValue({ id: "user-1", email: "real@example.com", passwordHash: "hash", displayName: "Angela" });
    mockVerifyPassword.mockResolvedValue(true);
    mockSignToken.mockResolvedValue("fake-jwt");

    const res = await POST(makeRequest({ email: "real@example.com", password: "correctpass" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.user.email).toBe("real@example.com");
    expect(mockSignToken).toHaveBeenCalledWith("user-1");
    expect(mockSetSessionCookie).toHaveBeenCalledWith("fake-jwt");
  });
});