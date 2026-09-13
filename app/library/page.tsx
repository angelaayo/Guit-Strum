import Link from "next/link";
import { getAllChords } from "@/app/lib/chord-queries";
import ChordDiagram from "@/app/components/ChordDiagram";
import MainHeader from "@/app/components/MainHeader";

export default async function LibraryPage() {
  const chords = await getAllChords();

  return (
    <div>
      <MainHeader />
      <div className="min-h-screen w-full flex flex-col items-center px-4 py-12 gap-10">
        <div className="text-center max-w-md">
          <h1
            className="font-source-serif font-semibold text-3xl mb-2"
            style={{ color: "var(--color-primary)" }}
          >
            Chord Library
          </h1>
          <p
            className="font-inter text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            Browse every chord shape, or tap one to practice it on its own.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 justify-center">
          {chords.map((chord) => (
            <Link
              key={chord.id}
              href={`/library/${chord.id}`}
              className="group flex flex-col items-center gap-2 rounded-2xl border p-4 w-44 transition-transform hover:-translate-y-1 hover:shadow-lg"
              style={{
                backgroundColor: "var(--color-card-bg)",
                borderColor: "var(--color-border)",
              }}
            >
              <ChordDiagram chord={chord} />
              <p
                className="font-source-serif font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                {chord.name}
              </p>
              <p
                className="font-inter text-xs uppercase tracking-wide"
                style={{ color: "var(--color-muted)" }}
              >
                {chord.difficulty}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
