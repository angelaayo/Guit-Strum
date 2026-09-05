// app/play/page.tsx
import MainHeader from "../components/MainHeader";
import ModeCard from "../components/ModeCard";
import { gameModes } from "../lib/chords";

export default function GameSelection() {
  return (
    <div>
      <MainHeader/>
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 gap-10">
        <div className="text-center max-w-md">
          <h1
            className="font-source-serif font-semibold text-3xl mb-2"
            style={{ color: "var(--color-primary)" }}
          >
            Choose Your Path
          </h1>
          <p
            className="font-inter text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            Select a difficulty level to begin your session. Each mode offers a
            unique challenge tailored to your current skill set.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 justify-center">
          {gameModes.map((mode) => (
            <ModeCard key={mode.id} mode={mode} />
          ))}
        </div>
      </div>
    </div>
  );
}
