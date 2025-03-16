import React, { useState } from "react";
import DisplayOutputAdvance from "./DisplayOutput/DisplayOutputAdvance";
import NumpadAdvance from "./Numpad/NumpadAdvance";

interface Props {
  addToHistory: (operation: string) => void;
}

const CalculatorAdvance = ({ addToHistory }: Props) => {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [displayFullOperation, setDisplayFullOperation] = useState<string>("");
  const [equalOperation, setEqualOperation] = useState<boolean>(false);
  const [prevInputOperator, setPrevInputOperator] = useState<boolean>(false);
  const [currentOperand, setCurrentOperand] = useState<string>("");

  // Extended list of operations
  const operations = [
    "+",
    "-",
    "x",
    "/",
    "*",
    "mod",
    "sin",
    "cos",
    "tan",
    "log",
    "ln",
    "^",
    "√",
    "!",
    "%",
    "x²",
    "x⁻¹",
  ];
  const specialOperations = ["mod", "sin", "cos", "tan", "log", "ln", "√", "x²", "x⁻¹"];
  const constants = ["π", "e"];

  const onClickKey = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value;

    if (/[0-9.]/.test(value)) {
      handleNumberInput(value);
    } else if (value === "AC") {
      handleAllClear();
    } else if (value === "DEL") {
      handleDeleteChar();
    } else if (value === "±") {
      handleNegateOperation();
    } else if (operations.includes(value)) {
      handleOperationInput(value);
    } else if (value === "=" || value === "Enter") {
      handleEqualOperation();
    } else if (value === "(" || value === ")") {
      handleParentheses(value);
    } else if (constants.includes(value)) {
      handleConstant(value);
    }
  };

  const handleAllClear = () => {
    setDisplayValue("");
    setCurrentOperand("");
    setDisplayFullOperation("");
    setEqualOperation(false);
    setPrevInputOperator(false);
  };

  const handleConstant = (constant: string) => {
    try {
      let value = constant === "π" ? Math.PI.toString() : Math.E.toString();

      // Similar logic to number input, but treating constants as complete values
      let newFullOperation: string;

      if (equalOperation) {
        newFullOperation = value;
        setDisplayValue("");
        setEqualOperation(false);
      } else if (prevInputOperator) {
        newFullOperation = `${displayFullOperation} ${value}`;
      } else if (displayFullOperation === "" || displayFullOperation === "0") {
        newFullOperation = value;
      } else {
        newFullOperation = `${displayFullOperation}${value}`;
      }

      setDisplayFullOperation(newFullOperation);
      setCurrentOperand(value);
      setPrevInputOperator(false);

      // Calculate if needed
      if (
        operations.some((op) => newFullOperation.includes(op)) &&
        !operations.some((op) => newFullOperation.endsWith(op))
      ) {
        const result = calculateFinalResult(newFullOperation);
        setDisplayValue(result);
      }
    } catch (error) {
      console.error("Error handling constant:", error);
      setDisplayValue("Error");
    }
  };

  // Modified handleParentheses function to handle implicit multiplication between parentheses
  // This should replace the existing handleParentheses function in CalculatorAdvance.tsx

  const handleParentheses = (parenthesis: string) => {
    try {
      let newFullOperation: string;

      if (equalOperation) {
        newFullOperation = parenthesis;
        setDisplayValue("");
        setEqualOperation(false);
        setCurrentOperand("");
      } else if (parenthesis === "(") {
        // Handle a scenario where a number is directly followed by an opening parenthesis - add implicit multiplication
        if (
          displayFullOperation !== "" &&
          !prevInputOperator &&
          !operations.some((op) => displayFullOperation.trim().endsWith(op)) &&
          !displayFullOperation.trim().endsWith("(")
        ) {
          newFullOperation = `${displayFullOperation} x (`;
        } else {
          newFullOperation = displayFullOperation === "" ? "(" : `${displayFullOperation} (`;
        }
        setCurrentOperand("");
      } else {
        // Closing parenthesis
        newFullOperation = `${displayFullOperation}${parenthesis}`;
        // Update current operand only if it's a closing parenthesis
        if (parenthesis === ")") {
          setCurrentOperand("");
        }
      }

      setDisplayFullOperation(newFullOperation);
      setPrevInputOperator(parenthesis === "(");

      // Calculate result if expression is complete
      if (isExpressionComplete(newFullOperation)) {
        const result = calculateFinalResult(newFullOperation);
        setDisplayValue(result);
      }
    } catch (error) {
      console.error("Error handling parentheses:", error);
      setDisplayValue("Error");
    }
  };

  // Check if an expression has balanced parentheses and valid operators
  const isExpressionComplete = (expr: string): boolean => {
    // Check for balanced parentheses
    let parenthesesCount = 0;
    for (const char of expr) {
      if (char === "(") parenthesesCount++;
      if (char === ")") parenthesesCount--;
      if (parenthesesCount < 0) return false; // Closing without opening
    }

    if (parenthesesCount !== 0) return false; // Unbalanced

    // Check if it doesn't end with an operator
    return !operations.some((op) => expr.trim().endsWith(op));
  };

  const handleDeleteChar = () => {
    if (displayFullOperation === "") return;

    try {
      let trimmedOperation = displayFullOperation;

      // Handle special operations or constants
      const hasSpecialOperation = specialOperations.some((op) => displayFullOperation.endsWith(op));
      const hasConstant = constants.some((c) => displayFullOperation.endsWith(c));

      if (hasSpecialOperation) {
        const matchingOperation = specialOperations.find((op) => displayFullOperation.endsWith(op));
        // Remove the entire special operation
        trimmedOperation = displayFullOperation
          .slice(0, displayFullOperation.length - (matchingOperation?.length || 0))
          .trim();
      } else if (hasConstant) {
        const matchingConstant = constants.find((c) => displayFullOperation.endsWith(c));
        // Remove the entire constant
        trimmedOperation = displayFullOperation
          .slice(0, displayFullOperation.length - (matchingConstant?.length || 0))
          .trim();
      } else {
        // Remove single character
        trimmedOperation = displayFullOperation.slice(0, -1).trim();
      }

      setDisplayFullOperation(trimmedOperation);

      // Update currentOperand based on the new trimmed operation
      if (trimmedOperation === "") {
        setCurrentOperand("");
        setDisplayValue("");
        setPrevInputOperator(false);
        return;
      }

      // Check if the last character is an operator
      if (
        operations.some((op) => trimmedOperation.endsWith(op)) ||
        trimmedOperation.endsWith("(")
      ) {
        setCurrentOperand("");
        setPrevInputOperator(true);
      } else {
        // Find the last operator or opening parenthesis in the string
        const lastIndex = Math.max(
          findLastOperatorIndex(trimmedOperation),
          trimmedOperation.lastIndexOf("(")
        );

        if (lastIndex !== -1) {
          // Extract the current operand (everything after the last operator or opening parenthesis)
          setCurrentOperand(trimmedOperation.slice(lastIndex + 1).trim());
        } else {
          // If no operator is found, the whole string is the operand
          setCurrentOperand(trimmedOperation);
        }
        setPrevInputOperator(false);
      }

      // Calculate the result of the new expression if it's complete
      if (isExpressionComplete(trimmedOperation)) {
        const result = calculateFinalResult(trimmedOperation);
        setDisplayValue(result);
      } else {
        setDisplayValue("");
      }
    } catch (error) {
      console.error("Error deleting character:", error);
      setDisplayValue("Error");
    }
  };

  // Helper function to find the last operator in a string
  const findLastOperatorIndex = (str: string): number => {
    for (let i = str.length - 1; i >= 0; i--) {
      // Skip anything inside parentheses when searching backwards
      if (str[i] === ")") {
        let parenthesesCount = 1;
        i--;
        while (i >= 0 && parenthesesCount > 0) {
          if (str[i] === ")") parenthesesCount++;
          if (str[i] === "(") parenthesesCount--;
          i--;
        }
        if (i < 0) break;
      }

      // Check for single character operators
      if (operations.some((op) => op.length === 1 && op === str[i])) {
        return i;
      }

      // Check for multi-character operators
      for (const op of operations) {
        if (
          op.length > 1 &&
          i - op.length + 1 >= 0 &&
          str.substring(i - op.length + 1, i + 1) === op
        ) {
          return i - op.length + 1;
        }
      }
    }
    return -1;
  };

  const handleNumberInput = (digit: string) => {
    try {
      // Handle decimal point
      if (digit === "." && currentOperand.includes(".")) {
        return; // Prevent multiple decimal points
      }

      let newFullOperation: string;
      let newCurrentOperand: string;

      // Case 1: After equals operation, start a new calculation
      if (equalOperation) {
        if (digit === ".") {
          newFullOperation = "0.";
          newCurrentOperand = "0.";
        } else {
          newFullOperation = digit;
          newCurrentOperand = digit;
        }
        setDisplayValue("");
        setEqualOperation(false);
      }
      // Case 2: After operator input or opening parenthesis
      else if (prevInputOperator) {
        // Check if the previous input was a unary prefix operator's opening parenthesis or just a parenthesis
        const unaryPrefixOps = ["sin", "cos", "tan", "log", "ln", "√"];
        const endsWithUnaryPrefix = unaryPrefixOps.some((op) =>
          displayFullOperation.trim().endsWith(`${op}(`)
        );
        const endsWithParenthesis = displayFullOperation.trim().endsWith("(");

        // Don't add space after unary prefix ops or opening parenthesis
        const shouldSkipSpace = endsWithUnaryPrefix || endsWithParenthesis;

        if (digit === ".") {
          if (shouldSkipSpace) {
            newFullOperation = `${displayFullOperation}0.`;
          } else {
            newFullOperation = `${displayFullOperation} 0.`;
          }
          newCurrentOperand = "0.";
        } else {
          if (shouldSkipSpace) {
            newFullOperation = `${displayFullOperation}${digit}`;
          } else {
            newFullOperation = `${displayFullOperation} ${digit}`;
          }
          newCurrentOperand = digit;
        }
      }
      // Case 3: Continuing number input
      else {
        if (displayFullOperation === "" && digit === ".") {
          // Starting with decimal point
          newFullOperation = "0.";
          newCurrentOperand = "0.";
        } else if (displayFullOperation === "0" && digit !== ".") {
          // Replace leading zero with digit
          newFullOperation = digit;
          newCurrentOperand = digit;
        } else if (currentOperand === "0" && digit !== ".") {
          // Replace zero with digit
          const lastOperatorIndex = findLastOperatorIndex(displayFullOperation);
          const lastParenIndex = displayFullOperation.lastIndexOf("(");
          const lastIndex = Math.max(lastOperatorIndex, lastParenIndex);

          if (lastIndex !== -1) {
            // If there's an operator or opening parenthesis, replace just the part after it
            const shouldAddSpace = !(displayFullOperation[lastIndex] === "(");

            newFullOperation =
              displayFullOperation.substring(0, lastIndex + 1) +
              (shouldAddSpace && displayFullOperation[lastIndex + 1] === " " ? " " : "") +
              digit;
          } else {
            newFullOperation = digit;
          }
          newCurrentOperand = digit;
        } else {
          // Normal case: append digit
          newFullOperation = displayFullOperation + digit;
          newCurrentOperand = currentOperand + digit;
        }
      }

      // Update state
      setDisplayFullOperation(newFullOperation);
      setCurrentOperand(newCurrentOperand);
      setPrevInputOperator(false);

      // Calculate result if expression is complete
      if (isExpressionComplete(newFullOperation)) {
        const result = calculateFinalResult(newFullOperation);
        setDisplayValue(result);
      }
    } catch (error) {
      console.error("Error handling number input:", error);
      setDisplayValue("Error");
    }
  };

  // Modified handleOperationInput function to prevent using minus as a negative input operation
  // This should replace the existing handleOperationInput function in CalculatorAdvance.tsx

  const handleOperationInput = (key: string) => {
    try {
      // Special handling for unary operators that can be applied directly
      const unaryPostfixOps = ["!", "x²", "x⁻¹", "%"];
      const unaryPrefixOps = ["sin", "cos", "tan", "log", "ln", "√"];

      // Case for unary postfix operators (applied to the current number)
      if (unaryPostfixOps.includes(key)) {
        if (displayFullOperation === "") return;

        // If after equals, apply to the result
        if (equalOperation) {
          let newOperation;
          if (key === "x²") {
            newOperation = `(${displayValue})²`;
          } else if (key === "x⁻¹") {
            newOperation = `(${displayValue})⁻¹`;
          } else {
            newOperation = `${displayValue}${key}`;
          }

          setDisplayFullOperation(newOperation);
          setCurrentOperand("");

          const result = calculateFinalResult(newOperation);
          setDisplayValue(result);
          setEqualOperation(true);
          return;
        }

        // Cannot apply these operators after another operator or at the start
        if (prevInputOperator || displayFullOperation === "") return;

        let newOperation;
        if (key === "x²") {
          // Handle squaring - need to identify the last number or parenthetical expression
          const lastOperatorIndex = findLastOperatorIndex(displayFullOperation);
          if (lastOperatorIndex !== -1) {
            const beforeOp = displayFullOperation.substring(0, lastOperatorIndex + 1);
            const afterOp = displayFullOperation.substring(lastOperatorIndex + 1).trim();

            // If the expression after the operator is complex, wrap it in parentheses
            if (afterOp.includes(" ") || afterOp.includes("(")) {
              newOperation = `${beforeOp}(${afterOp})²`;
            } else {
              newOperation = `${beforeOp}${afterOp}²`;
            }
          } else {
            newOperation = `${displayFullOperation}²`;
          }
        } else if (key === "x⁻¹") {
          // Handle reciprocal - similar to squaring
          const lastOperatorIndex = findLastOperatorIndex(displayFullOperation);
          if (lastOperatorIndex !== -1) {
            const beforeOp = displayFullOperation.substring(0, lastOperatorIndex + 1);
            const afterOp = displayFullOperation.substring(lastOperatorIndex + 1).trim();

            if (afterOp.includes(" ") || afterOp.includes("(")) {
              newOperation = `${beforeOp}(${afterOp})⁻¹`;
            } else {
              newOperation = `${beforeOp}${afterOp}⁻¹`;
            }
          } else {
            newOperation = `${displayFullOperation}⁻¹`;
          }
        } else {
          // For ! and %
          newOperation = `${displayFullOperation}${key}`;
        }

        setDisplayFullOperation(newOperation);
        setCurrentOperand("");

        const result = calculateFinalResult(newOperation);
        setDisplayValue(result);
        setEqualOperation(false);
        setPrevInputOperator(true);
        return;
      }

      // Case for unary prefix operators (applied to the next input)
      if (unaryPrefixOps.includes(key)) {
        let newOperation;

        if (equalOperation) {
          // Apply to the result
          newOperation = `${key}(${displayValue})`;

          setDisplayFullOperation(newOperation);
          setCurrentOperand("");

          const result = calculateFinalResult(newOperation);
          setDisplayValue(result);
          setEqualOperation(true);
        } else {
          // Append to current operation
          newOperation =
            displayFullOperation === "" ? `${key}(` : `${displayFullOperation} ${key}(`;

          setDisplayFullOperation(newOperation);
          setCurrentOperand("");
          setPrevInputOperator(true);
        }

        return;
      }

      // Regular binary operators (like +, -, *, /)
      if (displayFullOperation === "" && ["+", "-"].includes(key)) {
        // Allow + or - at the start for positive/negative numbers
        setDisplayFullOperation(key);
        setPrevInputOperator(true);
        return;
      } else if (displayFullOperation === "") {
        return; // Don't allow other operators at the start
      }

      let newOperation: string;

      // Case 1: After equals operation
      if (equalOperation) {
        newOperation = `${displayValue} ${key}`;
        setDisplayValue("");
      }
      // Case 2: Previous input was also an operator
      else if (prevInputOperator) {
        // Only allow minus after opening parenthesis, disallow it after other operators
        if (displayFullOperation.trim().endsWith("(") && key === "-") {
          newOperation = `${displayFullOperation} ${key}`;
        } else {
          // Replace previous operator if key is different from previous operator
          const trimmed = displayFullOperation.trim();
          // Find the last non-space character
          let lastNonSpaceIndex = trimmed.length - 1;
          while (lastNonSpaceIndex >= 0 && trimmed[lastNonSpaceIndex] === " ") {
            lastNonSpaceIndex--;
          }

          // Count how many characters to remove
          let charsToRemove = 1; // Default for single-char operators
          for (const op of operations) {
            if (op.length > 1 && trimmed.endsWith(op)) {
              charsToRemove = op.length;
              break;
            }
          }

          newOperation = trimmed.slice(0, -charsToRemove).trim() + ` ${key}`;
        }
      }
      // Case 3: Normal operation after number or closing parenthesis
      else {
        newOperation = `${displayFullOperation} ${key}`;
      }

      // Update state
      setDisplayFullOperation(newOperation);
      setCurrentOperand("");
      setEqualOperation(false);
      setPrevInputOperator(true);
    } catch (error) {
      console.error("Error handling operation input:", error);
      setDisplayValue("Syntax Error");
    }
  };

  const handleEqualOperation = () => {
    try {
      // Check if the operation is valid for calculation
      if (!isExpressionComplete(displayFullOperation)) {
        return; // Cannot calculate incomplete expressions
      }

      const result = calculateFinalResult(displayFullOperation);
      setDisplayValue(result);
      setEqualOperation(true);
      setCurrentOperand("");
      addToHistory(`${displayFullOperation} = ${result}`);
    } catch (error) {
      console.error("Error calculating result:", error);
      setDisplayValue("Syntax Error");
    }
  };

  // Helper function to calculate factorial
  const factorial = (n: number): number => {
    if (n < 0) throw new Error("Cannot calculate factorial of negative number");
    if (!Number.isInteger(n)) throw new Error("Cannot calculate factorial of non-integer");
    if (n > 170) throw new Error("Number too large for factorial calculation");

    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const calculateFinalResult = (fullOperation: string): string => {
    if (!fullOperation || fullOperation.trim() === "") return "0";

    try {
      // Clean up the operation string
      let processedOperation = fullOperation.trim();

      // Replace constants
      processedOperation = processedOperation.replace(/π/g, `(${Math.PI})`);
      processedOperation = processedOperation.replace(/e/g, `(${Math.E})`);

      // Handle adjacent parentheses for implicit multiplication: (a)(b) becomes (a)*(b)
      processedOperation = processedOperation.replace(/\)(\s*)\(/g, ")$1*(");

      // Handle special operations and conversions

      // Process factorial
      // Match factorials and replace with the calculated value
      while (processedOperation.includes("!")) {
        const factRegex = /(-?\d+(?:\.\d+)?)!/g;
        processedOperation = processedOperation.replace(factRegex, (match, number) => {
          const factResult = factorial(parseFloat(number));
          return factResult.toString();
        });

        // Handle more complex factorial cases with parentheses
        const parenFactRegex = /\(([^()]+)\)!/g;
        processedOperation = processedOperation.replace(parenFactRegex, (match, expr) => {
          // Evaluate the expression inside parentheses first
          const innerResult = eval(expr.replace(/x/g, "*"));
          const factResult = factorial(innerResult);
          return factResult.toString();
        });

        // If we still have factorials, it's likely an invalid expression
        if (processedOperation.includes("!")) break;
      }

      // Handle squaring (x²) and reciprocal (x⁻¹)
      processedOperation = processedOperation.replace(/(\d+(?:\.\d+)?)²/g, (match, number) => {
        return Math.pow(parseFloat(number), 2).toString();
      });
      processedOperation = processedOperation.replace(/\(([^()]+)\)²/g, (match, expr) => {
        const innerResult = eval(expr.replace(/x/g, "*"));
        return Math.pow(innerResult, 2).toString();
      });

      processedOperation = processedOperation.replace(/(\d+(?:\.\d+)?)⁻¹/g, (match, number) => {
        return (1 / parseFloat(number)).toString();
      });
      processedOperation = processedOperation.replace(/\(([^()]+)\)⁻¹/g, (match, expr) => {
        const innerResult = eval(expr.replace(/x/g, "*"));
        return (1 / innerResult).toString();
      });

      // Handle percentage
      processedOperation = processedOperation.replace(/(\d+(?:\.\d+)?)%/g, (match, number) => {
        return (parseFloat(number) / 100).toString();
      });

      // Handle exponentiation
      processedOperation = processedOperation.replace(
        /(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g,
        (match, base, exponent) => {
          return Math.pow(parseFloat(base), parseFloat(exponent)).toString();
        }
      );

      // Handle multiplication
      processedOperation = processedOperation.replace(/x/g, "*");

      // Process functions
      if (processedOperation.includes("sin")) {
        processedOperation = processedOperation.replace(/sin\s*\(([^()]+)\)/g, (match, expr) => {
          const innerResult = eval(expr.replace(/x/g, "*"));
          return Math.sin((innerResult * Math.PI) / 180).toString(); // Use degrees
        });
      }
      if (processedOperation.includes("cos")) {
        processedOperation = processedOperation.replace(/cos\s*\(([^()]+)\)/g, (match, expr) => {
          const innerResult = eval(expr.replace(/x/g, "*"));
          return Math.cos((innerResult * Math.PI) / 180).toString(); // Use degrees
        });
      }
      if (processedOperation.includes("tan")) {
        processedOperation = processedOperation.replace(/tan\s*\(([^()]+)\)/g, (match, expr) => {
          const innerResult = eval(expr.replace(/x/g, "*"));
          return Math.tan((innerResult * Math.PI) / 180).toString(); // Use degrees
        });
      }
      if (processedOperation.includes("log")) {
        processedOperation = processedOperation.replace(/log\s*\(([^()]+)\)/g, (match, expr) => {
          const innerResult = eval(expr.replace(/x/g, "*"));
          return Math.log10(innerResult).toString();
        });
      }
      if (processedOperation.includes("ln")) {
        processedOperation = processedOperation.replace(/ln\s*\(([^()]+)\)/g, (match, expr) => {
          const innerResult = eval(expr.replace(/x/g, "*"));
          return Math.log(innerResult).toString();
        });
      }
      if (processedOperation.includes("√")) {
        processedOperation = processedOperation.replace(/√\s*\(([^()]+)\)/g, (match, expr) => {
          const innerResult = eval(expr.replace(/x/g, "*"));
          return Math.sqrt(innerResult).toString();
        });
        processedOperation = processedOperation.replace(/√\s*(\d+(?:\.\d+)?)/g, (match, number) => {
          return Math.sqrt(parseFloat(number)).toString();
        });
      }
      if (processedOperation.includes("mod")) {
        processedOperation = processedOperation.replace(
          /(\d+(?:\.\d+)?)\s*mod\s*(\d+(?:\.\d+)?)/g,
          (match, n1, n2) => {
            return (parseFloat(n1) % parseFloat(n2)).toString();
          }
        );
      }

      // Calculate the result
      // eslint-disable-next-line no-eval
      const result = eval(processedOperation);

      // Check for valid result
      if (result === undefined || isNaN(result) || !isFinite(result)) {
        return "Undefined";
      }

      // Format the result
      return Number.isInteger(result)
        ? result.toString()
        : result.toFixed(10).replace(/\.?0+$/, "");
    } catch (error) {
      console.error("Calculation error:", error, "in operation:", fullOperation);
      return "Syntax Error";
    }
  };

  const handleNegateOperation = () => {
    if (displayFullOperation === "" || operations.some((op) => displayFullOperation.endsWith(op))) {
      return;
    }

    try {
      let newOperation: string;
      let newCurrentOperand: string;

      // After equals operation
      if (equalOperation) {
        const negatedValue = (-parseFloat(displayValue)).toString();
        newOperation = negatedValue;
        newCurrentOperand = negatedValue;
        setDisplayValue("");
        setEqualOperation(false);
      }
      // During normal input
      else {
        // Find the last operand in the operation
        const lastOperatorIndex = findLastOperatorIndex(displayFullOperation);
        const lastOpenParenIndex = displayFullOperation.lastIndexOf("(");
        const lastIndex = Math.max(lastOperatorIndex, lastOpenParenIndex);

        if (lastIndex !== -1) {
          // There's an operator or parenthesis - negate the part after it
          const prefix = displayFullOperation.substring(0, lastIndex + 1);
          const numberPart = displayFullOperation.substring(lastIndex + 1).trim();
          const negatedNumber = (-parseFloat(numberPart)).toString();

          newOperation = prefix + " " + negatedNumber;
          newCurrentOperand = negatedNumber;
        } else {
          // No operator - negate the whole thing
          newOperation = (-parseFloat(displayFullOperation)).toString();
          newCurrentOperand = newOperation;
        }

        // Calculate the new result if expression is complete
        if (isExpressionComplete(newOperation)) {
          const result = calculateFinalResult(newOperation);
          setDisplayValue(result);
        }
      }

      setDisplayFullOperation(newOperation);
      setCurrentOperand(newCurrentOperand);
    } catch (error) {
      console.error("Error negating value:", error);
      setDisplayValue("Error");
    }
  };

  return (
    <>
      <div className="w-150 rounded-lg border-3 border-solid border-neutral-700 mb-10 shadow-2xl shadow-black">
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
