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

  const operations = ["+", "-", "x", "/", "%"];

  const onCLickKey = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value;

    if (/[0-9.]/.test(value)) {
      handleNumberInput(value);
    }

    if (value === "AC") {
      handleAllClear(value);
    }

    if (value === "±") {
      handleNegateOperation();
    }

    if (operations.includes(value)) {
      handleOperation(value);
    }
  };

  const handleAllClear = (key: string) => {
    if (key === "AC") {
      setDisplayValue("0");
    }
  };

  const handleNumberInput = (digit: string) => {
    setDisplayValue(
      displayValue === "0"
        ? digit
        : displayValue.includes(".") && digit === "."
        ? displayValue
        : displayValue.concat(digit)
    );
  };

  const handleOperation = (key: string) => {
    if (displayValue === "0") return;

    if (operations.includes(displayValue.slice(-1))) {
      setDisplayValue(displayValue.slice(0, -1) + key);
    } else {
      setDisplayValue(displayValue + key);
    }

    if (["+", "-"].includes(key)) {
    }
    // const numericValue = parseFloat(displayValue);
    // setFirstOperand(numericValue);
    setWaitingForSecondOperand(true);
  };

  const handleNegateOperation = () => {
    if (operations.includes(displayValue)) return;
    const numericValue = parseFloat(displayValue);
    const negateValue = numericValue * -1;
    setDisplayValue(negateValue.toString());
  };

  const handleSecondOperand = (key: string) => {
    if (operations.includes(displayValue)) {
      console.log("secondOperand");
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
