import { FormulaObject } from "./validation";

export type FormulaInput = {
  name: string,
  expression: string;
  parts: {
    [name: string]: {
      expression: string;
      description?: string;
    };
  };
};

export const formulaWithParts: FormulaInput = {
  name: 'CatWithParts',
  expression:
    "parts['weightCo2'] + parts['foodCo2'] + 10",
  parts: {
    weightCo2: {
      expression: "weightKg * await ef(10) * (20 + 10 * 20 / 2 * ( 10 % 2 ))",
    },
    foodCo2: {
      expression: "foodKg * await ef(20)",
    },
  },
};

export const formulaWithPartsCalculationObject2: FormulaObject = {
  name: "CatWithParts",
  expressions: [
    {
      type: 'part',
      name: 'weightCo2',
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
        }
      ]
    },
    {
      type: 'part',
      name: 'foodCo2',
      expressions: [
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
        }
      ]
    }
  ]
}


// As this object is only used for validation it´s not important to keep references of parts.
// For an example when we would want to use this as the input and generate the expression string for evaluation out
// this object, check  the example above.
export const formulaWithPartsCalculationObject: FormulaObject = {
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

export const formula = "weightKg * ef(10)";

export const formulaCalculationObject: FormulaObject = {
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

export const complexCalculationObject: FormulaObject = {
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
