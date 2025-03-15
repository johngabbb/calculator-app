import React, { useState } from "react";
import DisplayOutputAdvance from "./DisplayOutput/DisplayOutputAdvance";
import NumpadAdvance from "./Numpad/NumpadAdvance";

interface Props {}

const CalculatorAdvance = (props: Props) => {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [displayFullOperation, setDisplayFullOperation] = useState<string>("");
  const [equalOperation, setEqualOperation] = useState<boolean>(false);
  const [prevInputOperator, setPrevInputOperator] = useState<boolean>(false);

  const operations = ["+", "-", "x", "/", "mod"];

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
      handleOperationInput(value);
    }

    if (value === "=") {
      calculateResult();
    }
  };

  const handleAllClear = (key: string) => {
    if (key === "AC") {
      setDisplayValue("");
      setDisplayFullOperation("");
      setEqualOperation(false);
      setPrevInputOperator(false);
    }
  };

  const handleDeleteChar = (key: string) => {
    if (displayFullOperation === "") return;

    setDisplayFullOperation(displayFullOperation.slice(0, -1));
    console.log(displayFullOperation.slice(0, -1));
    const result = calculateFinalResult(displayFullOperation.slice(0, -1));
    setDisplayValue(result);
  };

  const handleNumberInput = (digit: string) => {
    if (equalOperation) {
      setDisplayFullOperation(digit);
      setDisplayValue("");
      setEqualOperation(false);
    } else {
      setDisplayFullOperation(
        prevInputOperator ? `${displayFullOperation} ${digit}` : displayFullOperation.concat(digit)
      );

      if (operations.some((op) => displayFullOperation.includes(op))) {
        let fullOperation = displayFullOperation.concat(digit);

        const result = calculateFinalResult(fullOperation);
        setDisplayValue(result);
      }
    }

    setPrevInputOperator(false);
  };

  const handleOperationInput = (key: string) => {
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
    setEqualOperation(false);
    setPrevInputOperator(true);
  };

  const calculateResult = () => {
    if (
      operations.includes(displayFullOperation.slice(-1)) ||
      !operations.some((op) => displayFullOperation.includes(op))
    )
      return;
    setDisplayFullOperation(`${displayFullOperation}`);
    setEqualOperation(true);
  };

  const calculateFinalResult = (fullOperation: string) => {
    if (fullOperation.includes("x")) {
      fullOperation = fullOperation.replace(/x/g, "*");
    }

    return eval(fullOperation);
  };

  // Should negate display output value
  const handleNegateOperation = () => {
    const currentValue = parseFloat(displayValue);
    const negateValue = -1 * currentValue;
    setDisplayValue(negateValue.toString());
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
