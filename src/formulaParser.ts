export const extractParameters = (formula: string) => {
  formula = formula.replaceAll("await", "");
  console.log("formula", formula);
  const operators = "+-*/%";
  const variableIdentifiers = `,'`;
  const predefinedFunctions = ["ef"];

  const splitted = formula.split(/[+\-*\/%(),]+/gm);
  return splitted
    .map((v) => {
      v = v.trim();
      const isNoVar = variableIdentifiers.split("").some((s) => v.includes(s));
      return isNoVar ? null : v;
    })
    .filter((v) => v !== null)
    .filter((v) => v !== "")
    .filter((v) => isNaN(parseInt(v as string, 10)))
    .filter((v) => !predefinedFunctions.includes(v as string));
};
