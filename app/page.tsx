import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth";
import { getUserProgress } from "@/app/lib/chord-queries";
import {
  getRecommendedChord,
  getOverallStats,
  getAccuracy,
} from "@/app/lib/progress";
import MainHeader from "@/app/components/MainHeader";
import ChordDiagram from "@/app/components/ChordDiagram";
import ProgressBar from "@/app/components/ProgressBar";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) return null; // proxy.ts already redirects unauthenticated visitors before this ever renders

  const chords = await getUserProgress(user.id);
  const recommended = getRecommendedChord(chords);
  const stats = getOverallStats(chords);

  return (
    <div>
      <MainHeader />
      <div className="min-h-screen w-full flex flex-col items-center px-4 py-12 gap-10">
        <div className="text-center">
          <h1
            className="font-source-serif text-3xl font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            Welcome back, {user.displayName}
          </h1>
          <p
            className="font-inter text-sm mt-2"
            style={{ color: "var(--color-muted)" }}
          >
            Here's where you left off.
          </p>
        </div>

        {/* Recommended chord */}
        <Link
          href={`/library/${recommended.id}`}
          className="group w-full max-w-md rounded-2xl border p-6 flex flex-col items-center gap-3 transition-all hover:-translate-y-1 hover:shadow-lg"
          style={{
            backgroundColor: "var(--color-card-bg)",
            borderColor: "var(--color-border)",
          }}
        >
          <span
            className="font-inter text-xs uppercase tracking-wide"
            style={{ color: "var(--color-muted)" }}
          >
            {recommended.mastery.length === 0
              ? "New chord to try"
              : "Needs work"}
          </span>
          <ChordDiagram chord={recommended} />
          <p
            className="font-source-serif text-xl font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {recommended.name}
          </p>
          <div className="w-full">
            <ProgressBar accuracy={getAccuracy(recommended.mastery[0])} />
          </div>
        </Link>

        {/* Overall stats */}
        <div
          className="flex gap-8 rounded-xl border px-8 py-5"
          style={{
            backgroundColor: "var(--color-card-bg)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="text-center">
            <p
              className="font-source-serif text-2xl font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {stats.chordsTried}/{stats.totalChords}
            </p>
            <p
              className="font-inter text-xs"
              style={{ color: "var(--color-muted)" }}
            >
              Chords tried
            </p>
          </div>
          <div className="text-center">
            <p
              className="font-source-serif text-2xl font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {stats.overallAccuracy !== null
                ? `${Math.round(stats.overallAccuracy * 100)}%`
                : "—"}
            </p>
            <p
              className="font-inter text-xs"
              style={{ color: "var(--color-muted)" }}
            >
              Overall accuracy
            </p>
          </div>
          <div className="text-center">
            <p
              className="font-source-serif text-2xl font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {stats.masteredCount}
            </p>
            <p
              className="font-inter text-xs"
              style={{ color: "var(--color-muted)" }}
            >
              Mastered
            </p>
          </div>
        </div>

        {/* Every chord, worst-first, so the ones needing attention lead */}
        <div className="w-full max-w-xl flex flex-col gap-3">
          <h2
            className="font-source-serif font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            All chords
          </h2>
          {[...chords]
            .sort(
              (a, b) =>
                (getAccuracy(a.mastery[0]) ?? -1) -
                (getAccuracy(b.mastery[0]) ?? -1),
            )
            .map((chord) => (
              <Link
                key={chord.id}
                href={`/library/${chord.id}`}
                className="flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors hover:shadow-sm"
                style={{
                  backgroundColor: "var(--color-card-bg)",
                  borderColor: "var(--color-border)",
                }}
              >
                <span
                  className="font-inter text-sm w-16"
                  style={{ color: "var(--color-primary)" }}
                >
                  {chord.name}
                </span>
                <ProgressBar accuracy={getAccuracy(chord.mastery[0])} />
              </Link>
            ))}
        </div>

        {/* Honest placeholder for the vision beyond chords */}
        <div
          className="w-full max-w-md rounded-2xl border border-dashed p-6 text-center"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p
            className="font-source-serif font-semibold mb-1"
            style={{ color: "var(--color-primary)" }}
          >
            Song practice — coming soon
          </p>
          <p
            className="font-inter text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            Once you've got your chords down, GuitStrum will recommend real
            songs built from the chords you already know.
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/play"
            className="gs-button font-source-serif font-semibold rounded-xl px-6 py-3"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-bg)",
            }}
          >
            Play
          </Link>
          <Link
            href="/library"
            className="font-source-serif font-semibold rounded-xl px-6 py-3 border"
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-border)",
            }}
          >
            Browse Library
          </Link>
        </div>
      </div>
    </div>
  );
}
