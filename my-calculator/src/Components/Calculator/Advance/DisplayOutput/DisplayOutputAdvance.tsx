import React from "react";

interface Props {
  displayValue: string;
  displayFullOperation: string;
  equalOperation: boolean;
}

const DisplayOutputAdvance = ({ displayValue, displayFullOperation, equalOperation }: Props) => {
  return (
    <>
      <div className="bg-neutral-900 w-full rounded-t-lg p-5 pt-4 pb-5 border-b-3 border-neutral-700">
        <div className="flex flex-col gap-3">
          <div
            className={`w-full font-mono text-right pr-4 h-[2.5rem] ${
              equalOperation
                ? "text-neutral-500 text-2xl transition-all delay-75 duration-300 ease-in-out"
                : "text-white text-4xl transition-none"
            }`}
          >
            <span>{displayFullOperation}</span>
          </div>

          <div
            className={`w-full font-mono text-right pr-4 h-[2.5rem] ${
              !equalOperation
                ? "text-neutral-500 text-2xl "
                : "text-white text-4xl transition-all delay-75 duration-300 ease-in-out"
            }`}
          >
            {displayValue}
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayOutputAdvance;
