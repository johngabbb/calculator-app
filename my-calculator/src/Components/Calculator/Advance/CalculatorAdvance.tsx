import React, { useState } from "react";
import DisplayOutputAdvance from "./DisplayOutput/DisplayOutputAdvance";
import NumpadAdvance from "./Numpad/NumpadAdvance";

interface Props {}

const CalculatorAdvance = (props: Props) => {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [displayFullOperation, setDisplayFullOperation] = useState<string>("");
  const [equalOperation, setEqualOperation] = useState<boolean>(false);
  const [prevInputOperator, setPrevInputOperator] = useState<boolean>(false);
  const [currentOperand, setCurrentOperand] = useState<string>("");

  const operations = ["+", "-", "x", "/", "*"];

  const onClickKey = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value;

    if (/[0-9.]/.test(value)) {
      handleNumberInput(value);
    }

    if (value === "AC") {
      handleAllClear(value);
    }

    if (value === "DEL") {
      handleDeleteChar();
    }

    if (value === "±") {
      handleNegateOperation();
    }

    if (operations.includes(value)) {
      handleOperationInput(value);
    }

    if (value === "=") {
      calculateResult();
    }
  };

  const handleAllClear = (key: string) => {
    if (key === "AC") {
      setDisplayValue("");
      setCurrentOperand("");
      setDisplayFullOperation("");
      setEqualOperation(false);
      setPrevInputOperator(false);
    }
  };

  const handleDeleteChar = () => {
    if (displayFullOperation === "") return;

    try {
      const trimmedOperation = displayFullOperation.slice(0, -1).replace(/\s+$/, "");

      setDisplayFullOperation(trimmedOperation);

      const result = calculateFinalResult(trimmedOperation);
      setDisplayValue(!operations.some((op) => trimmedOperation.includes(op)) ? "" : result);
    } catch (error) {
      console.log("error deleting character", error);
    }
  };

  const handleNumberInput = (digit: string) => {
    if (digit === "." && currentOperand.includes(".")) {
      return;
    }

    try {
      setCurrentOperand(currentOperand.concat(digit));

      if (equalOperation) {
        if (digit === "." && (currentOperand === "" || currentOperand === ".")) {
          setDisplayFullOperation(`0${digit}`);
        } else {
          setDisplayFullOperation(digit);
        }
        setDisplayValue("");
        setEqualOperation(false);
      } else {
        if (prevInputOperator) {
          if (digit === "." && (currentOperand === "" || currentOperand === ".")) {
            setDisplayFullOperation(`${displayFullOperation} 0${digit}`);
          } else {
            setDisplayFullOperation(`${displayFullOperation} ${digit}`);
          }
        } else {
          if (digit === "." && (currentOperand === "" || currentOperand === ".")) {
            setDisplayFullOperation(displayFullOperation.concat("0").concat(digit));
          } else {
            setDisplayFullOperation(displayFullOperation.concat(digit));
          }
        }
        console.log(digit);
        console.log(currentOperand);
        if (operations.some((op) => displayFullOperation.includes(op))) {
          let fullOperation = displayFullOperation.concat(digit);

          const result = calculateFinalResult(fullOperation);
          setDisplayValue(result);
        }
      }

      setPrevInputOperator(false);
    } catch (error) {
      console.log("error handling number input", error);
    }
  };

  const handleOperationInput = (key: string) => {
    try {
      if (displayFullOperation === "") return;

      if (equalOperation) {
        setDisplayFullOperation(`${displayValue} ${key}`);
        setDisplayValue("");
      } else {
        if (prevInputOperator) {
          setDisplayFullOperation(`${displayFullOperation.slice(0, -1)} ${key}`);
        } else {
          setDisplayFullOperation(`${displayFullOperation} ${key}`);
        }
      }
      setCurrentOperand("");
      setEqualOperation(false);
      setPrevInputOperator(true);
    } catch (error) {
      console.log("error handling operation input", error);
    }
  };

  const calculateResult = () => {
    try {
      if (
        operations.includes(displayFullOperation.slice(-1)) ||
        !operations.some((op) => displayFullOperation.includes(op))
      )
        return;

      const result = calculateFinalResult(displayFullOperation);
      setDisplayValue(result);
      setEqualOperation(true);
      setCurrentOperand("");
    } catch (error) {
      console.log("error calculating result", error);
    }
  };

  const calculateFinalResult = (fullOperation: string) => {
    if (!fullOperation || fullOperation.trim() === "") return "0";

    try {
      let processedOperation = fullOperation.replace(/x/g, "*");

      // Handle trailing operators or decimal points
      if (operations.includes(processedOperation.slice(-1))) {
        processedOperation = processedOperation.slice(0, -1).trim();
        setPrevInputOperator(true);
      } else if (processedOperation.slice(-1) === ".") {
        processedOperation = processedOperation.slice(0, -1).trim();

        // Check if after removing decimal, there's an operator
        if (operations.includes(processedOperation.slice(-1))) {
          processedOperation = processedOperation.slice(0, -1).trim();
        }

        setPrevInputOperator(false);
      } else {
        setPrevInputOperator(false);
      }

      // Calculate the result
      const result = eval(processedOperation);

      // Check for valid result
      if (result === undefined || isNaN(result) || !isFinite(result)) {
        return "Error";
      }

      return result.toString();
    } catch (error) {
      console.error("Calculation error:", error);
      return "Error";
    }
  };

  // Should negate display output value
  const handleNegateOperation = () => {
    if (displayFullOperation === "" || operations.includes(displayFullOperation.slice(-1))) return;

    try {
      let currentValue = parseFloat(currentOperand || "0");
      let negateValue = -1 * currentValue;

      if (!equalOperation && currentOperand !== "") {
        // Find the last number in the operation and replace it
        const lastNumberRegex = /(-?\d*\.?\d+)$/;
        const updatedOperation = displayFullOperation.replace(
          lastNumberRegex,
          negateValue.toString()
        );
        const result = calculateFinalResult(updatedOperation);
        setDisplayValue(result);
        setDisplayFullOperation(updatedOperation);
        setCurrentOperand(negateValue.toString());
      } else {
        currentValue = parseFloat(displayValue);
        negateValue = -1 * currentValue;
        setDisplayFullOperation(negateValue.toString());
        setCurrentOperand("");
        setDisplayValue("");
        setEqualOperation(false);
      }
    } catch (error) {
      console.error("Error negating value:", error);
    }
  };
  return (
    <>
      <div className="w-150 rounded-lg border-3 border-solid border-neutral-700 mb-10">
        <DisplayOutputAdvance
          displayValue={displayValue}
          displayFullOperation={displayFullOperation}
          equalOperation={equalOperation}
        />
        <NumpadAdvance onClickKey={onClickKey} />
      </div>
    </>
  );
};

export default CalculatorAdvance;
