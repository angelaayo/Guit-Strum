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
import LockedFeature from "@/app/components/LockedFeature";

// Render a trailing "b" as a proper flat sign (e.g. Bb -> B♭).
function prettySymbol(family: string): string {
  return family.replace(/b/g, "♭");
}

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div>
        <MainHeader />
        <LockedFeature
          title="Your progress is waiting"
          description="Create an account to track which chords you've mastered, get personalized practice recommendations, and pick up right where you left off."
        />
      </div>
    );
  }

  const chords = await getUserProgress(user.id);
  const recommended = getRecommendedChord(chords);
  const stats = getOverallStats(chords);

  const statTiles = [
    {
      value: `${stats.chordsTried}/${stats.totalChords}`,
      label: "Chords tried",
    },
    {
      value:
        stats.overallAccuracy !== null
          ? `${Math.round(stats.overallAccuracy * 100)}%`
          : "—",
      label: "Overall accuracy",
    },
    { value: String(stats.masteredCount), label: "Mastered" },
  ];

  const recBadge =
    recommended.mastery.length === 0
      ? { bg: "#e8efe3", fg: "#5f7555", label: "New chord" }
      : { bg: "#f4e7d3", fg: "#99712f", label: "Needs work" };

  return (
    <div>
      <MainHeader />
      <div className="min-h-screen w-full px-6 py-12">
        <div className="mx-auto max-w-6xl flex flex-col gap-10">
          {/* Header */}
          <header>
            <p
              className="font-inter text-xs uppercase tracking-[0.2em] mb-3"
              style={{ color: "var(--color-muted)" }}
            >
              Pick up where you left off
            </p>
            <h1
              className="font-source-serif font-semibold text-5xl mb-3"
              style={{ color: "var(--color-string)" }}
            >
              Your Progress
            </h1>
            <p
              className="font-inter text-base"
              style={{ color: "var(--color-muted)" }}
            >
              Welcome back, {user.displayName} — here&apos;s how your chords are
              coming along.
            </p>
          </header>

          {/* Stat tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {statTiles.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border p-6"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "var(--color-border)",
                }}
              >
                <p
                  className="font-source-serif text-4xl font-semibold leading-none"
                  style={{ color: "var(--color-string)" }}
                >
                  {s.value}
                </p>
                <p
                  className="font-inter text-sm mt-2"
                  style={{ color: "var(--color-muted)" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Recommended + all chords */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Recommended next */}
            <div>
              <h2
                className="font-source-serif text-lg font-semibold mb-3"
                style={{ color: "var(--color-string)" }}
              >
                Recommended next
              </h2>
              <Link
                href={`/library/${recommended.id}`}
                className="group flex flex-col rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-md"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "var(--color-border)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="font-source-serif text-3xl font-semibold leading-none"
                      style={{ color: "var(--color-string)" }}
                    >
                      {prettySymbol(recommended.family)}
                    </p>
                    <p
                      className="font-inter text-sm mt-1.5"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {recommended.name}
                    </p>
                  </div>
                  <span
                    className="font-inter text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: recBadge.bg, color: recBadge.fg }}
                  >
                    {recBadge.label}
                  </span>
                </div>
                <div className="flex justify-center py-3">
                  <ChordDiagram chord={recommended} className="w-40 h-auto" />
                </div>
                <div
                  className="pt-3 border-t"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <ProgressBar accuracy={getAccuracy(recommended.mastery[0])} />
                </div>
              </Link>
            </div>

            {/* All chords, worst-first so the ones needing attention lead */}
            <div className="lg:col-span-2">
              <h2
                className="font-source-serif text-lg font-semibold mb-3"
                style={{ color: "var(--color-string)" }}
              >
                All chords
              </h2>
              <div className="flex flex-col gap-2.5">
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
                      className="flex items-center gap-4 rounded-xl border px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                      style={{
                        backgroundColor: "#ffffff",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <span
                        className="font-source-serif text-base font-semibold w-16 shrink-0"
                        style={{ color: "var(--color-string)" }}
                      >
                        {prettySymbol(chord.family)}
                      </span>
                      <ProgressBar accuracy={getAccuracy(chord.mastery[0])} />
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          {/* Honest placeholder for the vision beyond chords */}
          <div
            className="rounded-2xl border border-dashed p-6 text-center"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p
              className="font-source-serif font-semibold mb-1"
              style={{ color: "var(--color-string)" }}
            >
              Song practice — coming soon
            </p>
            <p
              className="font-inter text-sm"
              style={{ color: "var(--color-muted)" }}
            >
              Once you&apos;ve got your chords down, GuitStrum will recommend real
              songs built from the chords you already know.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
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
    </div>
  );
}
