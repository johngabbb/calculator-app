import { useState } from "react";
import "./App.css";
import Numpad from "./Components/Numpad/Numpad";
import DisplayOutput from "./Components/DisplayOutput/DisplayOutput";

interface Props {}

function App() {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [displayFullOperation, setDisplayFullOperation] = useState<string>("");
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
      setDisplayFullOperation("");
      setOperator("");
      setFirstOperand(null);
      setWaitingForSecondOperand(false);
    }
  };

  const handleNumberInput = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(
        displayValue === "0"
          ? digit
          : displayValue.includes(".") && digit === "."
          ? displayValue
          : displayValue.concat(digit)
      );
    }
    setDisplayFullOperation(
      displayFullOperation === ""
        ? digit
        : displayFullOperation.includes(".") && digit === "."
        ? displayFullOperation
        : displayFullOperation.concat(digit)
    );
  };

  const handleOperation = (key: string) => {
    if (displayValue === "0" && displayFullOperation === "") return;

    if (operator !== null && firstOperand !== null) {
      let result = 0;

      switch (key) {
        case "+":
        case "-":
          switch (operator) {
            case "+":
              result = firstOperand + parseFloat(displayValue);
              setFirstOperand(result);
              setOperator(key);
              setWaitingForSecondOperand(true);
              setDisplayValue(result.toString());
              break;
            case "-":
              result = firstOperand - parseFloat(displayValue);
              setFirstOperand(result);
              setOperator(key);
              setWaitingForSecondOperand(true);
              setDisplayValue(result.toString());
              break;
          }
          break;

        case "*":
        case "/":
          switch (operator) {
            case "*":
              result = firstOperand * parseFloat(displayValue);
              setFirstOperand(result);
              setOperator(key);
              setWaitingForSecondOperand(true);
              setDisplayValue(result.toString());
              break;
            case "/":
              result = firstOperand / parseFloat(displayValue);
              setFirstOperand(result);
              setOperator(key);
              setWaitingForSecondOperand(true);
              setDisplayValue(result.toString());
              break;
            default:
              setFirstOperand(parseFloat(displayValue));
              setOperator(key);
              setDisplayValue(displayValue);
          }
          break;
        default:
          result = 0;
      }
    }

    if (!(operator !== null && firstOperand !== null)) {
      setDisplayValue(displayValue);
      setOperator(key);
      setWaitingForSecondOperand(true);
      setFirstOperand(parseFloat(displayValue));
    }

    if (operations.includes(displayFullOperation.slice(-1))) {
      setDisplayFullOperation(displayFullOperation.slice(0, -1) + key);
    } else {
      setDisplayFullOperation(displayFullOperation + key);
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

  return (
    <div className="bg-black h-screen w-screen flex items-center justify-center">
      <main className="w-100 flex-none">
        <DisplayOutput
          displayValue={displayValue}
          displayFullOperation={displayFullOperation}
        />
        <Numpad onClickKey={onCLickKey} />
      </main>
    </div>
  );
}

export default App;
