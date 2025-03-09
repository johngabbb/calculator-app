import React from "react";
import { Button } from "../ui/button";
import DisplayOutput from "../DisplayOutput/DisplayOutput";

interface Props {
  onClickKey: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Numpad = ({ onClickKey }: Props) => {
  const keys = [
    ["7", "8", "9", "AC", "/"],
    ["4", "5", "6", "±", "x"],
    ["1", "2", "3", "%", "-"],
    ["Mode", "0", ".", "=", "+"],
  ];

  const getButtonClass = (key: string) => {
    if (
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "Mode"].includes(
        key
      )
    ) {
      return "bg-neutral-600";
    } else if (["±", "%", "AC"].includes(key)) {
      return "bg-neutral-500";
    } else if (["+", "-", "x", "/", "="].includes(key)) {
      return "bg-amber-500 hover:bg-amber-400";
    }
    return "bg-amber-500";
  };

  return (
    <>
      <div className="bg-black w-full rounded-b-lg p-4">
        {keys.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid grid-cols-5 gap-2 mb-2">
            {row.map((key) => (
              <Button
                key={key}
                value={key}
                onClick={onClickKey}
                className={`${getButtonClass(key)} py-4`}
              >
                {key}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Numpad;
