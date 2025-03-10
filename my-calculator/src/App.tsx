import { useState } from "react";
import "./App.css";
import Numpad from "./Components/Numpad/Numpad";
import DisplayOutput from "./Components/DisplayOutput/DisplayOutput";

interface Props {}

function App() {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] =
    useState<boolean>(false);

  const onCLickKey = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value;

    if (/[0-9.]/.test(value)) {
      handleNumberInput(value);
    }

    if (value === "AC") {
      handleAllClear(value);
    }
  };

  const handleNumberInput = (digit: string) => {
    setDisplayValue(
      displayValue === "0" && digit !== "." ? digit : displayValue + digit
    );
  };

  const handleAllClear = (key: string) => {
    if (key === "AC") {
      setDisplayValue("0");
    }
  };

  return (
    <div className="bg-black h-screen w-screen flex items-center justify-center">
      <main className="w-100 flex-none">
        <DisplayOutput displayValue={displayValue} />
        <Numpad onClickKey={onCLickKey} />
      </main>
    </div>
  );
}

export default App;
