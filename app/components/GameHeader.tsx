"use client";

import React from "react";
import Link from "next/link";
import { useAuth, useGuardedNav } from "@/app/lib/providers";

const GameHeader = ({
  currentScore,
  streak,
}: {
  currentScore: number;
  streak: number;
}) => {
  const user = useAuth();
  const guardedClick = useGuardedNav();

  return (
    <div
      className="border-b-2 flex justify-between p-3 items-center font-source-serif"
      style={{ borderBottomColor: "var(--color-border)" }}
    >
      <Link onClick={guardedClick} href={user ? "/" : "/play"}>
        <h2
          className="font-bold text-2xl"
          style={{ color: "var(--color-primary)" }}
        >
          GUIT STRUM
        </h2>
      </Link>

      <div className="flex gap-4 items-center justify-center">
        <div
          className="border rounded-lg px-3 py-1 flex gap-1 shadow-md"
          style={{
            backgroundColor: "var(--color-card-bg)",
            borderColor: "var(--color-border)",
          }}
        >
          <span>MULT</span>
          <span
            className="font-semibold text-xl"
            style={{ color: "var(--color-primary)" }}
          >
            x4
          </span>
        </div>
        <div
          className="font-semibold text-xl flex gap-2"
          style={{ color: "var(--color-primary)" }}
        >
          <span>SCORE:</span>
          <span>{currentScore}</span>
        </div>
        {streak > 1 && (
          <div
            className="font-semibold text-sm flex gap-1 items-center"
            style={{ color: "var(--color-primary-soft)" }}
          >
            🔥 <span>{streak}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameHeader;
