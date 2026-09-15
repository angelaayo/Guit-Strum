import { getAllChords } from "@/app/lib/chord-queries";
import LibraryGrid from "@/app/components/LibraryGrid";
import MainHeader from "@/app/components/MainHeader";
import { getCurrentUser } from "../lib/auth";
import LockedFeature from "@/app/components/LockedFeature";

export default async function LibraryPage() {
  const chords = await getAllChords();
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

        <LibraryGrid chords={chords} />
      </div>
    </div>
  );
}
