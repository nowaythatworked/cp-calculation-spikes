import { FormulaInput } from "./calculationObject";
import { FormulaObject, PartExpression, FunctionExpression, ParameterExpression, ValueExpression, ExpressionBase, NestedExpression } from "./validation";

export const transformFormula = (formula: FormulaInput) => {
  const formulaObject: FormulaObject = {
    name: formula.name,
    expressions: parseExpression(formula.expression, formula.parts)
  }
  
  return formulaObject
  //console.log(expressions[0].expressions[1])
}

const parseExpression = (expression: string, parts: FormulaInput['parts']): any => {
  const operatorIndexes = charIndexByArray(expression, ['+', '-', '*', '/', '%'])
  const expressions = splitOn(expression, ...operatorIndexes)
  console.log(expressions)

  let nestedExpressions = expression.split(/\(([^()]*)\)/g).map(v => { // /(?=\))/g
    console.log('1', v)
    if (!v.startsWith('(')) {
      const bracketIndex = v.indexOf('(')
      v = v.substring(bracketIndex)
    }
    console.log(v)
  })

  const tokens = expression.split(/(?=[+\-*\/%])/gm)?.map(v => v.trim()) as string[]
  return tokens.map(token => {
    const tokenDetails = token.split(/([+\-*\/%])/g)
    
    // no operator; defaults to '+'
    let operator: ExpressionBase['operator'] = '+'
    token = tokenDetails[0]
    if (tokenDetails.length > 1) {
      operator = tokenDetails[1].trim() as ExpressionBase['operator']
      token = tokenDetails[2]
    }
    
    // Parse parts
    if (token.startsWith('parts')) {
      const name = token.split(`'`)[1]
      const expression: PartExpression = {
        type: 'part',
        name,
        expressions: [
          ...parseExpression(parts[name].expression, parts)
        ]
      }

      return expression
    }

    if (token.includes('await')) {
      token = token.replace('await', '').trim()
    }

    if(token.includes('(')) {
      const FUNCTION_NAME_MIN_LENGTH = 1
      const bracketIndex = token.indexOf('(')
      if (bracketIndex >= FUNCTION_NAME_MIN_LENGTH && token.substring(0, bracketIndex - 1).match(/[a-zA-Z]/g)) {
          // parse function
          const functionName = token.split('(')[0].trim() as FunctionExpression['name']
          const argumentsArray = token.split(/[()]/g)[1].split(',').map(v => {
            v = v.trim()
            const vAsNumber = parseFloat(v)
            const stringValue = isStringInString(v) ? v.substring(1, v.length - 1) : v
    
            if (isNaN(vAsNumber)) {
              if (stringValue === 'true' || stringValue === 'false') {
                return Boolean(stringValue)
              }
              return stringValue
            }
            return vAsNumber
          })
          const expression: FunctionExpression = {
            type: 'function',
            name: functionName,
            arguments: [
              ...argumentsArray.map(argument => {
                if (isBaseType(argument)) {
                  return {
                    parameter: false,
                    value: argument
                  }
                }
                return {
                  parameter: true,
                  name: argument
                }
              })
            ] as FunctionExpression['arguments'],
            operator: operator,
          }
          return expression
      } else {
        console.log('NESTED', token)
        const expression: NestedExpression = {
          type: 'nested',
          operator: operator,
          expressions: []
        }
      } 
    }

    // parse parameter
    if (typeof token === 'string') {
      const expression: ParameterExpression = {
        type: 'parameter',
        name: token,
        operator: '+'
      }

      return expression
    }

    // parse value
    if (isBaseType(token)) {
      const expression: ValueExpression = {
        type: 'value',
        value: token,
        operator: '+'
      }
      return expression
    }
  })
}

const charIndexByArray = (string: string, searchArray: Array<string>) => {
  return string.split('').map((v, i) => {
    return searchArray.includes(v) ? i : null
  }).filter(v => v != null) as number[]
}

const splitOn = (string: string, ...indices: Array<number>) =>
  [0, ...indices].map((n, i, m) => string.slice(n, m[i + 1]));


// TODO: can be improved?
const isStringInString = (string: string) => {
  if (isNaN(parseInt(string))) {
    if (string.startsWith(`'`) && string.endsWith(`'`)) {
      return true
    }
  }
  return false
}

const isBaseType = (value: any) => !!(typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean')
