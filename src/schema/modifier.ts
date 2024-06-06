import { type Prisma } from "@prisma/client";
import { ModifierSchema } from "prisma/generated/zod";
import { type ZodType } from "zod";


export const ModifierInclude = {
  include: {
  }
}

export type Modifier = Prisma.ModifierGetPayload<typeof ModifierInclude>;

export const ModifierInputSchema = ModifierSchema.extend({}) satisfies ZodType<Modifier>;

export const defauleModifier: Modifier = {
  id: "",
  formula: "",
};