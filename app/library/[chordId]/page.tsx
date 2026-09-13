import { notFound } from "next/navigation";
import Link from "next/link";
import { getChordById, getMasteryForUser } from "@/app/lib/chord-queries";
import { chordTips } from "@/app/lib/chord-tips";
import { getCurrentUser } from "@/app/lib/auth";
import ChordDiagram from "@/app/components/ChordDiagram";
import ChordPractice from "@/app/components/ChordPractice";
import MainHeader from "@/app/components/MainHeader";

export default async function ChordDetailPage({
  params,
}: {
  params: Promise<{ chordId: string }>;
}) {
  const { chordId } = await params;
  const chord = await getChordById(chordId);
  if (!chord) return notFound();

  const user = await getCurrentUser();
  const mastery = user ? await getMasteryForUser(user.id, chord.id) : null;
  const tips = chordTips[chord.id];

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

        {user && (
          <div
            className="flex gap-6 rounded-xl border px-6 py-3"
            style={{
              backgroundColor: "var(--color-card-bg)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="text-center">
              <p
                className="font-source-serif text-xl font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                {mastery?.correctAttempts ?? 0}
              </p>
              <p
                className="font-inter text-xs"
                style={{ color: "var(--color-muted)" }}
              >
                Correct
              </p>
            </div>
            <div className="text-center">
              <p
                className="font-source-serif text-xl font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                {mastery?.incorrectAttempts ?? 0}
              </p>
              <p
                className="font-inter text-xs"
                style={{ color: "var(--color-muted)" }}
              >
                Missed
              </p>
            </div>
          </div>
        )}

        <ChordPractice chord={chord} />

        {tips && (
          <div className="max-w-sm w-full mt-4">
            <h2
              className="font-source-serif font-semibold mb-2"
              style={{ color: "var(--color-primary)" }}
            >
              Tips
            </h2>
            <ul className="flex flex-col gap-2">
              {tips.map((tip) => (
                <li
                  key={tip}
                  className="font-inter text-sm flex gap-2"
                  style={{ color: "var(--color-muted)" }}
                >
                  <span>—</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
