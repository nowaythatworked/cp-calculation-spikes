import { z } from "zod";

const expressionBase = z.object({
  //type: z.enum(["value", "function", "nested"]),
  operator: z.enum(["+", "-", "*", "/", "%"]),
});

type ExpressionBase = z.infer<typeof expressionBase>;

const valueExpression = expressionBase.extend({
  type: z.literal("value"),
  //parameter: z.literal(false), // required when type != function | nested
  value: z.number(),
});

const parameterExpression = expressionBase.extend({
  type: z.literal("parameter"),
  //parameter: z.literal(true), // required when type != function | nested
  name: z.string(),
});

// TODO: Create map of functions to zod-objects validating the input (arguments)
// Same Map can be used to map implementation of function to pass to VM2
const functionExpression = expressionBase.extend({
  type: z.literal("function"),
  name: z.enum(["ef", "choice"]),
  arguments: z.array(
    z
      .object({
        parameter: z.literal(true),
        name: z.string(), // required when parameter == true
      })
      .or(
        z.object({
          parameter: z.literal(false),
          value: z.string().or(z.number()), // required when parameter == false
        })
      )
  ),
});

const mergedExpressions = valueExpression
  .or(parameterExpression)
  .or(functionExpression);

type MergedExpressions = z.infer<typeof mergedExpressions>;

type NestedExpression = {
  type: "nested";
  operator: ExpressionBase["operator"];
  expressions: Array<NestedExpression | MergedExpressions>;
};

const nestedExpression: z.ZodType<NestedExpression> = z.late
  .object(() => ({
    type: z.literal("nested"),
    expressions: z.array(nestedExpression.or(mergedExpressions)),
  }))
  .extend(expressionBase.shape);

const schema = z.object({
  name: z.string(),
  expressions: z.array(nestedExpression.or(mergedExpressions)),
});

export type CalculationObject = z.infer<typeof schema>;
export const validate = (object: any) => schema.safeParse(object);
