export default function ProgressBar({ accuracy }: { accuracy: number | null }) {
  const percent = accuracy !== null ? Math.round(accuracy * 100) : 0;

  return (
    <div className="w-full flex items-center gap-3">
      <div
        className="flex-1 h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--color-border)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percent}%`,
            backgroundColor:
              accuracy === null ? "var(--color-muted)" : "var(--color-primary)",
          }}
        />
      </div>
      <span
        className="font-inter text-xs w-10 text-right"
        style={{ color: "var(--color-muted)" }}
      >
        {accuracy !== null ? `${percent}%` : "—"}
      </span>
    </div>
  );
}
