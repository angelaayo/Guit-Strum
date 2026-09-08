import { getModeById } from "@/app/lib/chords";
import { notFound } from "next/navigation";
import { getChordsForMode } from "@/app/lib/chord-queries";
import PlayModeContent from "@/app/components/PlayModeContent";
export default async function PlayMode({
  params,
}: {
  params: Promise<{ modeId: string }>;
}) {
  const { modeId } = await params;
  const mode = getModeById(modeId);
  if (!mode) return notFound();

  const chords = await getChordsForMode(mode);

  return <PlayModeContent modeChords={chords} />;
}
