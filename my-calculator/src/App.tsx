import { useState } from "react";
import "./App.css";
import Numpad from "./Components/Numpad/Numpad";
import DisplayOutput from "./Components/DisplayOutput/DisplayOutput";
import ModeButtons from "./Components/ModeButtons/ModeButtons";

function App() {
  const [activeMode, setActiveMode] = useState<"basic" | "advance">("basic");
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [displayFullOperation, setDisplayFullOperation] = useState<string>("");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [equalOperation, setEqualOperation] = useState<boolean>(false);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] =
    useState<boolean>(false);

  const operations = ["+", "-", "x", "/", "%", "="];

  const onClickKey = (e: React.MouseEvent<HTMLButtonElement>) => {
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
      setDisplayFullOperation("");
      setOperator(null);
      setFirstOperand(null);
      setWaitingForSecondOperand(false);
    }
  };

  const handleNumberInput = (digit: string) => {
    if (waitingForSecondOperand || equalOperation) {
      setDisplayValue(digit);
      setEqualOperation(false);
      setDisplayFullOperation(equalOperation ? "" : displayFullOperation);
    } else {
      if (displayValue === "0" && digit !== ".") {
        setDisplayValue(digit);
      } else if (digit === "." && displayValue.includes(".")) {
        setDisplayValue(displayValue);
      } else {
        setDisplayValue(displayValue.concat(digit));
      }
      setDisplayFullOperation(
        displayFullOperation === "" ? "" : displayFullOperation
      );
    }
    setWaitingForSecondOperand(false);
  };

  // &&
  // !waitingForSecondOperand

  const handleOperation = (key: string) => {
    if (operator !== null && firstOperand !== null) {
      let result = firstOperand;
      switch (operator) {
        case "+":
          result = result + parseFloat(displayValue);
          break;
        case "-":
          result = result - parseFloat(displayValue);
          break;
        case "x":
          result = result * parseFloat(displayValue);
          break;
        case "/":
          result = result / parseFloat(displayValue);
          break;
        case "%":
          result = result % parseFloat(displayValue);
          break;
      }

      if (key === "=") {
        setEqualOperation(true);
        setOperator(operator);
        if (!equalOperation) {
          setFirstOperand(parseFloat(displayValue));
          setDisplayFullOperation(
            `${firstOperand} ${operator} ${displayValue}`
          );
        } else {
          setDisplayFullOperation(
            `${displayValue} ${operator} ${firstOperand}`
          );
        }
        setWaitingForSecondOperand(false);
        setDisplayValue(result.toString());
      } else {
        setOperator(key);
        setDisplayValue(result.toString());
        setFirstOperand(result);
        setWaitingForSecondOperand(true);
        setDisplayFullOperation(` ${result} ${key}`);
      }
    } else {
      setOperator(key);
      setFirstOperand(parseFloat(displayValue));
      setWaitingForSecondOperand(true);
      setDisplayFullOperation(
        parseFloat(displayValue).toString().concat(` ${key}`)
      );
    }
  };

  // Should negate second operand value
  const handleNegateOperation = () => {
    if (
      operations.includes(displayValue) &&
      operations.includes(displayFullOperation)
    )
      return;

    const numericValue = parseFloat(displayValue);
    const displayFullOperationValue = parseFloat(displayFullOperation);
    const negateValue = numericValue * -1;
    const negateDisplay = displayFullOperationValue * -1;
    setDisplayValue(negateValue.toString());
    setDisplayFullOperation(negateDisplay.toString());
  };

  const handleModeChange = (mode: "basic" | "advance") => {
    setActiveMode(mode);
  };

  return (
    // <div className="flex flex-col items-center justify-center overflow-auto min-h-screen w-full">
    <div className="flex flex-col items-center justify-center overflow-auto min-h-screen w-full bg-neutral-900 bg-image  bg-[size:15px_15px] [background-image:linear-gradient(to_right,rgba(100,100,100,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,100,100,0.2)_1px,transparent_1px)]">
      <ModeButtons
        activeMode={activeMode}
        handleModeChange={handleModeChange}
      />

      <div className="w-100 rounded-lg border-3 border-solid border-neutral-700 mb-10">
        <DisplayOutput
          displayValue={displayValue}
          displayFullOperation={displayFullOperation}
        />
        <Numpad onClickKey={onClickKey} />
      </div>
    </div>
  );
}

export default App;
