//mini game view
// import ChordImage from "../components/ChordCard";
import ModeCard from "../components/ModeCard";
import { gameModes } from "../lib/chords";

export default function gameSelection() {
  return (
    <div className="flex flex-col justify-center items-center px-4">
      <div className="border text-center">
        <h1
          className="font-source-serif font-semi-bold"
          style={{ color: "var(--color-primary)" }}
        >
          Choose Your Path
        </h1>
        <h3 className="w-100">
          Select a difficulty level to begin your session. Each mode offers a
          unique challenge tailored to your current skill set.
        </h3>
      </div>
      <div className="flex gap-4">
        {gameModes.map((mode) => (
          <ModeCard key={mode.id} mode={mode} />
        ))}
      </div>
    </div>
  );
}
