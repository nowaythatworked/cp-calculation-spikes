import { z } from "zod";

const object0 = z.object({
  c: z.string().optional()
});

const object1 = object0.extend({
  type: z.literal("type1"),
  a: z.literal(true)
});

const object2 = object0.extend({
  type: z.literal("type2"),
  b: z.literal(true)
});

const schema = object1.or(object2);

export type Object = z.infer<typeof schema>;
export const zodTest = (object: Object) => schema.safeParse(object);
