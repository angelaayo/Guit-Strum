import React from "react";

const GameHeader = () => {
  return (
    <div
      className="border-b-2 flex justify-between p-3 items-center font-source-serif"
      style={{ borderBottomColor: "var(--color-border" }}
    >
      <h2
        className=" font-bold text-2xl"
        style={{ color: "var(--color-primary)" }}
      >
        GUIT STRUM
      </h2>
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
        <div className="font-semibold text-xl" style={{ color: "var(--color-primary)" }}>
          <span>SCORE: </span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
