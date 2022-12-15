import { CalculationObject } from "./validation";

export const formula = "weightKg * await ef(10)";

export const formulaCalculationObject: CalculationObject = {
  name: "SimpleCat",
  expressions: [
    {
      type: "parameter",
      name: "weightKg",
      operator: "+"
    },
    {
      type: "function",
      name: "ef",
      operator: "*",
      arguments: [
        {
          value: 10,
          parameter: false
        }
      ]
    }
  ]
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
      operator: "+"
    },
    {
      type: "function",
      name: "ef",
      operator: "*",
      arguments: [
        {
          value: 777,
          parameter: false
        }
      ]
    },
    {
      type: "nested",
      operator: "+",
      expressions: [
        {
          type: "parameter",
          name: "weightKg",
          operator: "+"
        },
        {
          type: "function",
          name: "ef",
          operator: "*",
          arguments: [
            {
              value: 31337,
              parameter: false
            }
          ]
        }
      ]
    },
    {
      name: "foodKg",
      type: "parameter",
      operator: "+"
    },
    {
      type: "function",
      name: "choice",
      operator: "*",
      arguments: [
        {
          parameter: false,
          value: "foodTypes"
        },
        {
          parameter: true,
          name: "foodType"
        },
        {
          parameter: false,
          value: "summer"
        }
      ]
    }
  ]
};
