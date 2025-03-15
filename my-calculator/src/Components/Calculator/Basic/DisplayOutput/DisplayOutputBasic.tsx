interface Props {
  displayFullOperation: string;
  displayValue: string;
}

const DisplayOutputBasic = ({ displayFullOperation, displayValue }: Props) => {
  return (
    <>
      <div className="bg-neutral-900 w-full rounded-t-lg p-5 pt-4 pb-5 border-b-3 border-neutral-700">
        <div className="flex flex-col gap-3">
          <div className="w-full h-full min-h-[2.25rem] text-neutral-500 text-right text-2xl font-mono pr-4">
            <span>{displayFullOperation}</span>
          </div>
          <div className="w-full min-h-[2.5rem] text-white text-right text-4xl font-mono pr-4">{displayValue}</div>
        </div>
      </div>
    </>
  );
};

export default DisplayOutputBasic;
