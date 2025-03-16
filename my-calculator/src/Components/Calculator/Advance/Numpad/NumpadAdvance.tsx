import { Button } from "@/Components/ui/button";
import React from "react";

interface Props {
  onClickKey: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const NumpadAdvance = ({ onClickKey }: Props) => {
  const advanceKeys = [
    ["(", "sin", "cos"],
    [")", "ln", "log"],
    ["x²", "tan", "π"],
    ["x⁻¹", "e", "^"],
    ["%", "!", "√"],
  ];

  const keys = [
    ["7", "8", "9", "+", "AC"],
    ["4", "5", "6", "-", "DEL"],
    ["1", "2", "3", "x", "/"],
    ["mod", "0", ".", "±", "="],
  ];

  const getButtonClass = (key: string) => {
    if (key === "=") {
      return "bg-cyan-600 hover:bg-cyan-500 transition-colors border-0 shadow-none";
    } else {
      return "bg-neutral-800 hover:bg-cyan-900 transition-colors shadow-none group";
    }
  };

  const getTextClass = (key: string) => {
    if (!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "="].includes(key)) {
      return "text-neutral-600 group-hover:text-white transition-colors delay-150";
    } else if (key === "=") {
      return "text-black text-lg";
    } else {
      return "text-neutral-200 group-hover:text-white transition-colors delay-150";
    }
  };

  return (
    <>
      <div className="bg-neutral-800 w-full rounded-b-lg p-4">
        <div className="flex flex-row gap-5">
          <div className="h-auto">
            {advanceKeys.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="grid grid-cols-3 gap-2 mb-2">
                {row.map((key) => (
                  <Button
                    key={key}
                    value={key}
                    onClick={onClickKey}
                    className={`${getButtonClass(key)} py-4`}
                  >
                    <span className={`${getTextClass(key)} `}>{key}</span>
                  </Button>
                ))}
              </div>
            ))}
          </div>

          <div className="mx-2 flex  justify-center">
            <div className="h-full w-px bg-neutral-600"></div>
          </div>

          <div className="mt-5">
            {keys.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="grid grid-cols-5 gap-2 mb-2">
                {row.map((key) => (
                  <Button
                    key={key}
                    value={key}
                    onClick={onClickKey}
                    className={`${getButtonClass(key)} py-4`}
                  >
                    <span className={getTextClass(key)}>{key}</span>
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NumpadAdvance;
