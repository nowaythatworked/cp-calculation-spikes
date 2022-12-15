import { VM, NodeVM } from "vm2";
import {
  formula,
  formulaCalculationObject,
  complexFormula,
  complexCalculationObject
} from "./calculationObject";
import { extractParameters } from "./formulaParser";
import { generateInputSchema } from "./generateInputSchema";
import { validate } from "./validation";

console.log(process.version);

/**
 * 1. transform string to tree (if this fails it´s not a valid mathematical expression; brackets are wrong)
 * 2. validate tree (validates usage of valid functions, correct usage of functions & usage of valid operators)
 * 3. generate inputSchema (using the tree, a inputSchema can be generated rather simple)
 * 4. validate inputSchema (this schema can be validated using ajv to double check our automated process before storing)
 * 5. execute calculation (in real world this would be in another context)
 */

generateInputSchema(complexCalculationObject);
const validationResult = validate(complexCalculationObject);
if (!validationResult.success) {
  console.log(validationResult.error);
}

const vm = new VM({
  wasm: false,
  sandbox: {
    weightKg: 5,
    ageYears: 10,
    foodKg: 20,
    foodType: "WET",
    ef: async (num: number) => num + 10,
    choice: async (id: string, choice: string, option: string) =>
      choice === "WET" ? 3 : 1000
  }
});

(async () => {
  const num: Promise<number> = await vm.run(`new Promise(async (res) => { 
    res(${complexFormula})
   })`);
  console.log(num);
})();
