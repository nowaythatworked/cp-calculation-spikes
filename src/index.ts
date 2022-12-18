import { promises } from 'fs'
import { calculateWithParts } from "./calculation"
import { formulaWithParts } from "./calculationObject"
import { transformFormula } from "./formulaParser"
import { validate } from './validation'

/**
 * 1. transform string to tree (if this fails it´s not a valid mathematical expression; brackets are wrong)
 * 2. validate tree (validates usage of valid functions, correct usage of functions & usage of valid operators)
 * 3. generate inputSchema (using the tree, a inputSchema can be generated rather simple)
 * 4. validate inputSchema (this schema can be validated using ajv to double check our automated process before storing)
 * 5. execute calculation 
 *  Alternatively if we want to use the calculationObject as an input, we´d generate the expression string before step 5 and step 1 would be removed
 */
(async () => {
    const formulaObject = transformFormula(formulaWithParts)
    await promises.writeFile('formulaObject.json', JSON.stringify(formulaObject, null, 2))

    const validationResult = validate(formulaObject);
    if (!validationResult.success) {
      console.log(validationResult.error);
    }
    
    const result = await calculateWithParts(formulaWithParts, {
      weightKg: 10,
      foodKg: 10,
      ef: async (id: number) => id + 10
    })
  
    console.log(result)
  })() 
