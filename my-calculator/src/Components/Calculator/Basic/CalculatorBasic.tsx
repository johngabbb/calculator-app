import React, { useState } from "react";
import DisplayOutputBasic from "./DisplayOutput/DisplayOutputBasic";
import NumpadBasic from "./Numpad/NumpadBasic";

interface Props {}

const CalculatorBasic = (props: Props) => {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [displayFullOperation, setDisplayFullOperation] = useState<string>("");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [equalOperation, setEqualOperation] = useState<boolean>(false);
  const [operator, setOperator] = useState<string | null>(null);
  const [prevOperator, setPrevOperator] = useState<string | null>(null);
  const [secondOperand, setSecondOperand] = useState<number>(0);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);

  const operations = ["+", "-", "x", "/", "mod", "="];

  const onClickKey = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value;

    if (/[0-9.]/.test(value)) {
      handleNumberInput(value);
    }

    if (value === "AC") {
      handleAllClear(value);
    }

    if (value === "DEL") {
      handleDeleteChar(value);
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
      setSecondOperand(0);
      setPrevOperator(null);
      setWaitingForSecondOperand(false);
    }
  };

  const handleDeleteChar = (key: string) => {
    if (displayValue === "0") return;

    if (key === "DEL") {
      if (displayFullOperation.includes("=")) {
        setDisplayFullOperation("");
      } else {
        setDisplayValue(displayValue.length === 1 ? "0" : displayValue.slice(0, -1));
      }
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
      setDisplayFullOperation(displayFullOperation === "" ? "" : displayFullOperation);
    }
    setWaitingForSecondOperand(false);
  };

  const handleOperation = (key: string) => {
    // Handling operations
    if (key !== "=") {
      if (operator !== null && firstOperand !== null && !waitingForSecondOperand) {
        const secondOperand = parseFloat(displayValue);
        let result = calculateResult(firstOperand, secondOperand, operator);

        setDisplayValue(result.toString());

        setFirstOperand(result);

        setDisplayFullOperation(`${result} ${key}`);
      } else {
        setFirstOperand(parseFloat(displayValue));
        setDisplayFullOperation(parseFloat(displayValue).toString().concat(` ${key}`));
      }

      setOperator(key);
      setPrevOperator(null);
      setWaitingForSecondOperand(true);
      setEqualOperation(false);
    }
    // Handling equals sign
    else {
      const currentValue = parseFloat(displayValue);

      // If this is the first equals after an operation
      if (!equalOperation) {
        // Store the second operand for repeat operations
        const secondOperand = currentValue;
        setSecondOperand(secondOperand);

        // If we have a first operand and an operator, calculate the result
        if (firstOperand !== null && operator !== null) {
          const result = calculateResult(firstOperand, secondOperand, operator);

          setDisplayValue(result.toString());

          setDisplayFullOperation(`${firstOperand} ${operator} ${secondOperand} =`);

          setPrevOperator(operator);

          setEqualOperation(true);
        }
      }
      // If equals is pressed again after a previous equals
      else if (equalOperation && prevOperator !== null) {
        // Use the stored second operand and previous operator
        const result = calculateResult(parseFloat(displayValue), secondOperand, prevOperator);

        setDisplayValue(result.toString());
        setDisplayFullOperation(`${currentValue} ${prevOperator} ${secondOperand} =`);
      }

      // After equals, we're not waiting for a second operand anymore
      setWaitingForSecondOperand(false);
      setOperator("=");
    }
  };

  const calculateResult = (firstOperand: number, secondOperand: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstOperand + secondOperand;
      case "-":
        return firstOperand - secondOperand;
      case "x":
        return firstOperand * secondOperand;
      case "/":
        return firstOperand / secondOperand;
      case "mod":
        return firstOperand % secondOperand;
      default:
        return secondOperand;
    }
  };

  // Should negate display output value
  const handleNegateOperation = () => {
    const currentValue = parseFloat(displayValue);
    const negateValue = -1 * currentValue;
    setDisplayValue(negateValue.toString());
  };

  return (
    <>
      <div className="w-100 rounded-lg border-3 border-solid border-neutral-700 mb-10">
        <DisplayOutputBasic displayValue={displayValue} displayFullOperation={displayFullOperation} />
        <NumpadBasic onClickKey={onClickKey} />
      </div>
    </>
  );
};

export default CalculatorBasic;
