import { SkillSchema, SkillEffectSchema, SkillCostSchema, SkillYieldSchema } from "prisma/generated/zod";
import { z } from "zod";

export const SkillEffectInputSchema = SkillEffectSchema.extend({
  skillCost: z.array(SkillCostSchema),
  skillYield: z.array(SkillYieldSchema),
});

export const SkillInputSchema = SkillSchema.extend({
  skillEffect: z.array(
    SkillEffectInputSchema,
  ),
});
