import { Button } from "../ui/button";

interface Props {
  activeMode: "standard" | "advance";
  handleModeChange: (mode: "standard" | "advance") => void;
  setHistoryClick: (e: boolean) => void;
  historyClick: boolean;
}

const ModeButtons = ({ activeMode, handleModeChange, setHistoryClick, historyClick }: Props) => {
  const handleHistoryClick = () => {
    setHistoryClick(!historyClick);
  };

  return (
    <>
      <div className="flex flex-col gap-5 mb-5 w-min">
        <Button
          className={`px-4 py-2 rounded min-w-30 transform transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ${
            activeMode === "standard"
              ? "bg-emerald-800 text-white hover:bg-emerald-800"
              : "bg-neutral-700 text-white hover:bg-emerald-950"
          }`}
          onClick={() => handleModeChange("standard")}
        >
          Standard
        </Button>

        <Button
          className={`px-4 py-2 rounded min-w-30 transform transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ${
            activeMode === "advance"
              ? "bg-emerald-800 text-white hover:bg-emerald-800"
              : "bg-neutral-700 text-white hover:bg-emerald-950"
          }`}
          onClick={() => handleModeChange("advance")}
        >
          Advance
        </Button>

        <Button
          className={`mt-10 transform transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ${
            historyClick
              ? "bg-emerald-800 text-white hover:bg-emerald-950"
              : "bg-neutral-700 text-white hover:bg-emerald-950"
          } `}
          onClick={handleHistoryClick}
        >
          History
        </Button>
      </div>
    </>
  );
};

export default ModeButtons;
