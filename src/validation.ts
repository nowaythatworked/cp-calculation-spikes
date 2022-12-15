import { number, z } from "zod";

const expressionSchema: z.ZodType = z.late.object(() => ({
  type: z.enum(["value", "function", "nested"]),
  name: z.string().optional(), // required when type != nested
  parameter: z.boolean().optional(), // required when type != function | nested
  operator: z.enum(["+", "-", "*", "/", "%"]),
  arguments: z
    .array(
      z.object({
        value: z.string().or(z.number()).optional(), // required when parameter == false
        name: z.string().optional(), // required when parameter == true
        parameter: z.boolean()
      })
    )
    .optional(), // required when type == function
  expressions: z.array(expressionSchema).optional()
}));

// ======

// =======

const expressionBase = z.object({
  //type: z.enum(["value", "function", "nested"]),
  operator: z.enum(["+", "-", "*", "/", "%"])
});

type ExpressionBase = z.infer<typeof expressionBase>;

const valueExpression = expressionBase.extend({
  type: z.literal("value"),
  //parameter: z.literal(false), // required when type != function | nested
  value: z.number()
});

type ValueExpression = z.infer<typeof valueExpression>;

const parameterExpression = expressionBase.extend({
  type: z.literal("parameter"),
  //parameter: z.literal(true), // required when type != function | nested
  name: z.string()
});

const functionExpression = expressionBase.extend({
  type: z.literal("function"),
  name: z.enum(["ef", "choice"]),
  arguments: z.array(
    z
      .object({
        parameter: z.literal(true),
        name: z.string() // required when parameter == true
      })
      .or(
        z.object({
          parameter: z.literal(false),
          value: z.string().or(z.number()) // required when parameter == false
        })
      )
  )
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
    expressions: z.array(nestedExpression.or(mergedExpressions))
  }))
  .extend(expressionBase.shape);

const schema = z.object({
  name: z.string(),
  expressions: z.array(nestedExpression.or(mergedExpressions))
});

export type CalculationObject = z.infer<typeof schema>;
export const validate = (object: any) => schema.safeParse(object);
