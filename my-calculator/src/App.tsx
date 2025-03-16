import { useState } from "react";
import "./App.css";
import ModeButtons from "./Components/ModeButtons/ModeButtons";
import CalculatorAdvance from "./Components/Calculator/Advance/CalculatorAdvance";
import CalculatorBasic from "./Components/Calculator/Basic/CalculatorBasic";
import HistoryTab from "./Components/HistoryTab/HistoryTab";

function App() {
  const [activeMode, setActiveMode] = useState<"standard" | "advance">("standard");
  const [historyClick, setHistoryClick] = useState<boolean>(false);
  const [historyArray, setHistoryArray] = useState<string[]>([]);

  const addToHistory = (operation: string) => {
    setHistoryArray([...historyArray, operation]);
  };

  const handleModeChange = (mode: "standard" | "advance") => {
    setActiveMode(mode);
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 min-h-screen w-full bg-neutral-900 bg-image overflow-hidden
      bg-[size:15px_15px] [background-image:linear-gradient(to_right,rgba(100,100,100,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,100,100,0.2)_1px,transparent_1px)]"
    >
      <div className="order-2 md:order-1 relative max-w-sm">
        <div
          className={`bg-neutral-800 h-64 md:h-screen overflow-hidden shadow-2xl shadow-black transition-all delay-100 duration-300 ${
            historyClick ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <HistoryTab
            historyClick={historyClick}
            historyArray={historyArray}
            setHistoryArray={setHistoryArray}
          />
        </div>
      </div>

      <div className="order-1 md:order-2 flex flex-col items-center justify-center min-h-[500px] md:min-h-0 relative">
        <div className="relative w-[320px] h-[500px]">
          {/* Standard Calculator */}
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all delay-100 duration-300 ease-in-out ${
              activeMode === "standard" ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <CalculatorBasic addToHistory={addToHistory} />
          </div>

          {/* Advanced Calculator */}
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all delay-100 duration-300 ease-in-out ${
              activeMode === "standard" ? "opacity-0 z-0" : "opacity-100 z-10"
            }`}
          >
            <CalculatorAdvance addToHistory={addToHistory} />
          </div>
        </div>

        <div className="text-white text-center mt-6 md:absolute md:bottom-20">
          DEV BY GabMaxHunter
        </div>
      </div>

      <div className="order-3 flex justify-center md:justify-start md:items-center md:ml-20 my-4 md:my-0 relative">
        <ModeButtons
          activeMode={activeMode}
          handleModeChange={handleModeChange}
          setHistoryClick={setHistoryClick}
          historyClick={historyClick}
        />
      </div>
    </div>
  );
}

export default App;
