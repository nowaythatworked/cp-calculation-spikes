import type { FormulaObject } from "./validation";

const getParametersFromExpressions = (
  expressions: FormulaObject["expressions"]
): Array<string> => {
  return expressions
    .map((expression) => {
      if (expression.type === "parameter") {
        return expression.name;
      }
      if (expression.type === "nested") {
        return getParametersFromExpressions(expression.expressions);
      }
      return null;
    })
    .filter((v) => v != null)
    .flat(10) as string[];
};

const getArgumentsFromExpressions = (
  expressions: FormulaObject["expressions"]
): Array<string> => {
  return expressions
    .map((expression) => {
      if (expression.type === "parameter") {
        return expression.name;
      }
      if (expression.type === "nested") {
        return getParametersFromExpressions(expression.expressions);
      }
      return null;
    })
    .filter((v) => v != null)
    .flat(10) as string[];
};

export const generateInputSchema = (calculationObject: FormulaObject) => {
  const schema = {
    title: calculationObject.name,
  };
  // get all expressions
  // loop expressions
  // get parameters & arguments
  // construct object
  const params = getParametersFromExpressions(calculationObject.expressions);
  console.log(params);
};
