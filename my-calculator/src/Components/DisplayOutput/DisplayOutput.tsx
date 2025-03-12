import React from "react";

interface Props {
  displayFullOperation: string;
  displayValue: string;
}

const DisplayOutput = ({ displayFullOperation, displayValue }: Props) => {
  return (
    <>
      <div className="bg-black w-full rounded-t-lg p-4 pt-8 pb-8">
        <div className="w-full text-white text-right text-4xl font-mono pr-4">
          {displayFullOperation}
        </div>
        <div className="w-full text-white text-right text-4xl font-mono pr-4">
          {displayValue}
        </div>
      </div>
    </>
  );
};

export default DisplayOutput;
