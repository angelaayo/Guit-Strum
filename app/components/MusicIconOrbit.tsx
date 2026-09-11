// app/components/MusicIconOrbit.tsx
import { Guitar, Music2, Mic2, Disc3, AudioLines } from "lucide-react";

export default function MusicIconOrbit({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const dimensions = size === "sm" ? "w-32 h-32" : "w-48 h-48";
  const centerSize = size === "sm" ? "w-14 h-14" : "w-20 h-20";
  const satelliteSize = size === "sm" ? "w-9 h-9" : "w-12 h-12";
  const centerIconSize = size === "sm" ? 24 : 32;
  const satelliteIconSize = size === "sm" ? 16 : 20;

  const satellites = [
    {
      Icon: Music2,
      position: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    {
      Icon: Mic2,
      position: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
    },
    {
      Icon: Disc3,
      position: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    },
    {
      Icon: AudioLines,
      position: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
    },
  ];

  return (
    <div className={`relative ${dimensions} ${className}`}>
      <div
        className="absolute inset-0 rounded-full border border-dashed"
        style={{ borderColor: "var(--color-border)" }}
      />
      {satellites.map(({ Icon, position }, i) => (
        <div
          key={i}
          className={`absolute ${position} ${satelliteSize} rounded-full flex items-center justify-center border shadow-sm`}
          style={{
            backgroundColor: "var(--color-card-bg)",
            borderColor: "var(--color-border)",
          }}
        >
          <Icon
            size={satelliteIconSize}
            style={{ color: "var(--color-primary)" }}
          />
        </div>
      ))}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${centerSize} rounded-full flex items-center justify-center shadow-md`}
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <Guitar size={centerIconSize} style={{ color: "var(--color-bg)" }} />
      </div>
    </div>
  );
}
