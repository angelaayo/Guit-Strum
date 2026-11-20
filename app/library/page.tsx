import { getAllChords } from "@/app/lib/chord-queries";
import LibraryGrid from "@/app/components/LibraryGrid";
import MainHeader from "@/app/components/MainHeader";
import { getCurrentUser } from "../lib/auth";
import LockedFeature from "@/app/components/LockedFeature";

export default async function LibraryPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div>
        <MainHeader />
        <LockedFeature
          title="Chord Library"
          description="Sign in to browse every chord shape in detail and practice them one at a time."
        />
      </div>
    );
  }
  const chords = await getAllChords();

  return (
    <div>
      <MainHeader />
      <div className="min-h-screen w-full px-6 py-12">
        <div className="mx-auto max-w-6xl flex flex-col gap-8">
          <header>
            <p
              className="font-inter text-xs uppercase tracking-[0.2em] mb-3"
              style={{ color: "var(--color-muted)" }}
            >
              A little practice, every day
            </p>
            <h1
              className="font-source-serif font-semibold text-5xl mb-3"
              style={{ color: "var(--color-string)" }}
            >
              Chord Library
            </h1>
            <p
              className="font-inter text-base"
              style={{ color: "var(--color-muted)" }}
            >
              Browse every chord shape, or tap one to practice it on its own.
            </p>
          </header>

          <LibraryGrid chords={chords} />

          <footer
            className="mt-2 pt-6 border-t flex flex-wrap items-center gap-x-6 gap-y-2"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span
              className="font-inter text-sm font-semibold"
              style={{ color: "var(--color-string)" }}
            >
              Reading a chord
            </span>
            <span className="font-inter text-sm" style={{ color: "var(--color-muted)" }}>
              ○ Open string
            </span>
            <span className="font-inter text-sm" style={{ color: "var(--color-muted)" }}>
              ✕ Muted string
            </span>
            <span className="font-inter text-sm" style={{ color: "var(--color-muted)" }}>
              1–4 Finger placement
            </span>
            <span
              className="font-inter text-sm italic ml-auto"
              style={{ color: "var(--color-muted)" }}
            >
              One shape at a time. Make it yours.
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
