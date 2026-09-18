import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

// TODO: mock @/app/lib/prisma — you'll need mockFindUnique and mockCreate
// TODO: mock @/app/lib/auth — you'll need mockHashPassword, mockSignToken, mockSetSessionCookie

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/signup", () => {
  it("rejects an invalid email", async () => {
    const res = await POST(
      makeRequest({
        username: "Angela",
        password: "12345678",
        email: "angela123",
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: "Enter a valid email address" });
  });

  it("rejects a password under 8 characters", async () => {
    const res = await POST(
      makeRequest({
        username: "Angela",
        password: "123",
        email: "angela123@gmail.com",
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: "Password must be at least 8 characters" });
  });

  it("returns 409 when the email is already registered", async () => {
    // hint: make your mocked findUnique resolve to a truthy fake user object
  });

  it("creates a user and sets a session cookie on success", async () => {
    // hint: findUnique resolves to null (no existing user),
    // create resolves to a fake created user object,
    // then check the response status and that setSessionCookie was called
  });
});
