import { CrystalSchema, ModifierSchema, ModifiersListSchema, RateSchema } from "prisma/generated/zod";
import { z } from "zod";

export const CrystalRateInputSchema = RateSchema.extend({
  
});

export const ModifierInputSchema = ModifierSchema.extend({});

export const ModifiersListInputSchema = ModifiersListSchema.extend({
  modifiers: z.array(ModifierInputSchema),
});

export const CrystalInputSchema = CrystalSchema.extend({
  modifiersList: ModifiersListInputSchema,
  rates: z.array(CrystalRateInputSchema)
});
