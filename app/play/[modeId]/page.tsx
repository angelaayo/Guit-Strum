// app/play/[modeId]/page.tsx
"use client";
import { use } from "react";
import dynamic from "next/dynamic";
import { getModeById } from "@/app/lib/chords";
import { notFound } from "next/navigation";

const PlayModeContent = dynamic(
  () => import("@/app/components/PlayModeContent"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p style={{ color: "var(--color-muted)" }}>Loading...</p>
      </div>
    ),
  }
);

export default function PlayMode({ params }: { params: Promise<{ modeId: string }> }) {
  const { modeId } = use(params);
  const mode = getModeById(modeId);
  if (!mode) return notFound();

  return <PlayModeContent mode={mode} />;
}