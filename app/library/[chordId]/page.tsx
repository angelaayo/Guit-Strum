import { notFound } from "next/navigation";
import { getChordById } from "@/app/lib/chord-queries";
import ChordDiagram from "@/app/components/ChordDiagram";
import ChordPractice from "@/app/components/ChordPractice";
import MainHeader from "@/app/components/MainHeader";
import Link from "next/link";

export default async function ChordDetailPage({
  params,
}: {
  params: Promise<{ chordId: string }>;
}) {
  const { chordId } = await params;
  const chord = await getChordById(chordId);
  if (!chord) return notFound();

  return (
    <div>
      <MainHeader />
      <div className="min-h-screen w-full flex flex-col items-center px-4 py-12 gap-8">
        <Link
          href="/library"
          className="font-inter text-sm self-start ml-4 sm:ml-0"
          style={{ color: "var(--color-muted)" }}
        >
          ← Back to library
        </Link>

        <ChordDiagram chord={chord} />

        <div className="text-center">
          <h1
            className="font-source-serif text-4xl font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {chord.name}
          </h1>
          <p
            className="font-inter text-xs uppercase tracking-wide mt-1"
            style={{ color: "var(--color-muted)" }}
          >
            {chord.difficulty}
            {chord.isBarre && " • Barre chord"}
          </p>
        </div>

        <ChordPractice chord={chord} />
      </div>
    </div>
  );
}
