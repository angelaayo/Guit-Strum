import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import LiveMicStream from "./LiveMicStream";

// --- Fake WebSocket, since jsdom doesn't implement one ---
class FakeWebSocket {
  static instances: FakeWebSocket[] = [];
  url: string;
  onmessage: ((e: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  readyState = 1; // OPEN
  sent: unknown[] = [];

  constructor(url: string) {
    this.url = url;
    FakeWebSocket.instances.push(this);
  }
  send(data: unknown) {
    this.sent.push(data);
  }
  close() {}
  static get OPEN() {
    return 1;
  }
}

// --- Fake AudioContext/AudioWorkletNode ---
class FakeAudioWorkletNode {
  port = { onmessage: null as ((e: { data: Float32Array }) => void) | null };
  constructor() {}
}

class FakeAudioContext {
  sampleRate = 48000;
  audioWorklet = { addModule: vi.fn().mockResolvedValue(undefined) };
  createMediaStreamSource = vi.fn().mockReturnValue({ connect: vi.fn() });
  close = vi.fn();
}

beforeEach(() => {
  FakeWebSocket.instances = [];
  vi.stubGlobal("WebSocket", FakeWebSocket);
  vi.stubGlobal("AudioContext", FakeAudioContext);
  vi.stubGlobal("AudioWorkletNode", FakeAudioWorkletNode);
  vi.stubGlobal("navigator", {
    mediaDevices: {
      getUserMedia: vi.fn().mockResolvedValue({}),
    },
  });
});

describe("LiveMicStream", () => {
  it("opens a WebSocket with the real sample rate in the URL", async () => {
    render(<LiveMicStream onPrediction={vi.fn()} />);

    await waitFor(() => expect(FakeWebSocket.instances.length).toBe(1));
    expect(FakeWebSocket.instances[0].url).toContain("sampleRate=48000");
  });

  it("can send data over the socket once connected", async () => {
    render(<LiveMicStream onPrediction={vi.fn()} />);
    await waitFor(() => expect(FakeWebSocket.instances.length).toBe(1));

    const ws = FakeWebSocket.instances[0];
    const fakeSamples = new Float32Array([0.1, 0.2, 0.3]);

    ws.send(fakeSamples.buffer);
    expect(ws.sent.length).toBe(1);
  });

  it("calls onPrediction when the server sends a detected chord", async () => {
    const onPrediction = vi.fn();
    render(<LiveMicStream onPrediction={onPrediction} />);
    await waitFor(() => expect(FakeWebSocket.instances.length).toBe(1));

    const ws = FakeWebSocket.instances[0];
    ws.onmessage?.({
      data: JSON.stringify({ detectedChord: "G", confidence: 0.9 }),
    });

    expect(onPrediction).toHaveBeenCalledWith("G", 0.9);
  });

  it("shows a retry button when the microphone is denied", async () => {
    vi.stubGlobal("navigator", {
      mediaDevices: {
        getUserMedia: vi
          .fn()
          .mockRejectedValue(
            new DOMException("Permission denied", "NotAllowedError"),
          ),
      },
    });

    const { findByText } = render(<LiveMicStream onPrediction={vi.fn()} />);
    expect(await findByText(/denied/i)).toBeTruthy();
    expect(await findByText(/retry/i)).toBeTruthy();
  });
});
