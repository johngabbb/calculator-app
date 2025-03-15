import { useState } from "react";
import "./App.css";
import ModeButtons from "./Components/ModeButtons/ModeButtons";
import CalculatorAdvance from "./Components/Calculator/Advance/CalculatorAdvance";
import CalculatorBasic from "./Components/Calculator/Basic/CalculatorBasic";
import HistoryTab from "./Components/HistoryTab/HistoryTab";

function App() {
  const [activeMode, setActiveMode] = useState<"standard" | "advance">("standard");
  const [historyClick, setHistoryClick] = useState<boolean>(false);

  const handleHistoryTab = () => {
    setHistoryClick(true);
  };

  const handleModeChange = (mode: "standard" | "advance") => {
    setActiveMode(mode);
  };

  return (
    <div
      className="grid grid-cols-3 content-center overflow-auto min-h-screen w-full bg-neutral-900 bg-image  
      bg-[size:15px_15px] [background-image:linear-gradient(to_right,rgba(100,100,100,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,100,100,0.2)_1px,transparent_1px)]"
    >
      <div>
        <HistoryTab historyClick={historyClick} />
      </div>

      <div className="flex flex-col items-center justify-center">
        <div
          className={`transition-all delay-100 duration-300 ease-in-out ${
            activeMode === "standard"
              ? "opacity-100 scale-100"
              : "opacity-0 scale-50 absolute pointer-events-none"
          }`}
        >
          <CalculatorBasic />
        </div>

        <div
          className={`transition-all delay-100 duration-300 ease-in-out ${
            activeMode === "standard"
              ? "opacity-0 scale-50 absolute pointer-events-none"
              : "opacity-100 scale-100"
          }`}
        >
          <CalculatorAdvance />
        </div>

        <div className="text-white absolute bottom-40">DEV MY GabMaxHunter</div>
      </div>

      <div className="flex items-center justify-start ml-20">
        <ModeButtons
          activeMode={activeMode}
          handleModeChange={handleModeChange}
          handleHistoryTab={handleHistoryTab}
        />
      </div>
    </div>
  );
}

export default App;
