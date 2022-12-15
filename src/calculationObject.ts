import { CalculationObject } from "./validation";

type CalculationInput = {
  expression: string;
  parts: {
    [name: string]: {
      expression: string;
      description?: string;
    };
  };
};

export const formulaWithParts: CalculationInput = {
  expression:
    "parts['weightCo2'].expression + parts['foodCo2'].expression + 10",
  parts: {
    weightCo2: {
      expression: "weightKg * await ef(10)",
    },
    foodCo2: {
      expression: "foodKg * await ef(20)",
    },
  },
};

// As this object is only used for validation it´s not important to keep references of parts.
// When we would want to use this as the input and generate the expression string for evaluation out
// this object, another layer would need to added. This is not a big complexity tho.
export const formulaWithPartsCalculationObject: CalculationObject = {
  name: "CatWithParts",
  expressions: [
    {
      type: "parameter",
      name: "weightKg",
      operator: "+",
    },
    {
      type: "function",
      name: "ef",
      operator: "*",
      arguments: [
        {
          parameter: false,
          value: 10,
        },
      ],
    },
    {
      type: "parameter",
      name: "foodKg",
      operator: "+",
    },
    {
      type: "function",
      name: "ef",
      operator: "*",
      arguments: [
        {
          parameter: false,
          value: 20,
        },
      ],
    },
    {
      type: "value",
      value: 10,
      operator: "+",
    },
  ],
};

export const formula = "weightKg * await ef(10)";

export const formulaCalculationObject: CalculationObject = {
  name: "SimpleCat",
  expressions: [
    {
      type: "parameter",
      name: "weightKg",
      operator: "+",
    },
    {
      type: "function",
      name: "ef",
      operator: "*",
      arguments: [
        {
          value: 10,
          parameter: false,
        },
      ],
    },
  ],
};

// ###########################
export const complexFormula =
  "ageYears * await ef(777) + (weightKg * await ef(31337)) + foodKg * await choice('foodTypes', foodType, 'summer')";

export const complexCalculationObject: CalculationObject = {
  name: "CatKg",
  expressions: [
    {
      name: "ageYears",
      type: "parameter",
      operator: "+",
    },
    {
      type: "function",
      name: "ef",
      operator: "*",
      arguments: [
        {
          value: 777,
          parameter: false,
        },
      ],
    },
    {
      type: "nested",
      operator: "+",
      expressions: [
        {
          type: "parameter",
          name: "weightKg",
          operator: "+",
        },
        {
          type: "function",
          name: "ef",
          operator: "*",
          arguments: [
            {
              value: 31337,
              parameter: false,
            },
          ],
        },
      ],
    },
    {
      name: "foodKg",
      type: "parameter",
      operator: "+",
    },
    {
      type: "function",
      name: "choice",
      operator: "*",
      arguments: [
        {
          parameter: false,
          value: "foodTypes",
        },
        {
          parameter: true,
          name: "foodType",
        },
        {
          parameter: false,
          value: "summer",
        },
      ],
    },
  ],
};
