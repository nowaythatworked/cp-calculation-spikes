import { VM } from "vm2";
import { FormulaInput } from "./calculationObject";

 export const calculateWithParts = async (formula: FormulaInput, parameters: Record<string, any>) => {
  const vm = new VM({
    wasm: false,
    eval: true,
    sandbox: {
      formula,
      ...parameters
    }
  })

  return await vm.run(`new Promise(async (res) => {
    // First calculate parts and store them in object to be referencable for the main expression
    const parts = {}
    const entries = Object.entries(formula.parts)
    for (let i = 0; i <= entries.length - 1; i++) {
      const [key, part] = entries[i]
      parts[key] = await eval('new Promise(async resolve => resolve(' + part.expression + '))')
    }
    
    const expressionResult = await eval('new Promise(async resolve => { const parts = ' + JSON.stringify(parts) + '; resolve(' + formula.expression + ') })')
    res({
      co2: expressionResult,
      parts
    })
  })
`)
 }
