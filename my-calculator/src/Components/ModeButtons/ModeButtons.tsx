import React from "react";
import { Button } from "../ui/button";

interface Props {
  activeMode: "basic" | "advance";
  handleModeChange: (mode: "basic" | "advance") => void;
}

const ModeButtons = ({ activeMode, handleModeChange }: Props) => {
  return (
    <>
      <div className="flex flex-col gap-5 mb-5 mr-70">
        <Button
          className={`px-4 py-2 rounded min-w-30 ${
            activeMode === "basic"
              ? "bg-emerald-800 text-white hover:bg-emerald-800"
              : "bg-neutral-700 text-white hover:bg-emerald-950 transition-colors"
          }`}
          onClick={() => handleModeChange("basic")}
        >
          Basic
        </Button>

        <Button
          className={`px-4 py-2 rounded min-w-30 ${
            activeMode === "advance"
              ? "bg-emerald-800 text-white hover:bg-emerald-800"
              : "bg-neutral-700 text-white hover:bg-emerald-950 transition-colors"
          }`}
          onClick={() => handleModeChange("advance")}
        >
          Advance
        </Button>
      </div>
    </>
  );
};

export default ModeButtons;
