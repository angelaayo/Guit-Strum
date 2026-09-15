"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/app/lib/providers";

const GameHeader = ({ currentScore }: { currentScore: number }) => {
  const user = useAuth();

  return (
    <div
      className="border-b-2 flex justify-between p-3 items-center font-source-serif"
      style={{ borderBottomColor: "var(--color-border)" }}
    >
      <Link href={user ? "/" : "/play"}>
        <h2
          className="font-bold text-2xl"
          style={{ color: "var(--color-primary)" }}
        >
          GUIT STRUM
        </h2>
      </Link>

      <div className="flex gap-4 items-center justify-center">
        <div
          className="font-semibold text-xl flex gap-2"
          style={{ color: "var(--color-primary)" }}
        >
          <span>SCORE:</span>
          <span>{currentScore}</span>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
