
import { SkillSchema, SkillEffectSchema, SkillCostSchema, SkillYieldSchema } from "prisma/generated/zod";
import { z } from "zod";

export const skillEffectInputSchema = SkillEffectSchema.extend({
  skillCost: z.array(SkillCostSchema),
  skillYield: z.array(SkillYieldSchema),
})

export const skillInputSchema = SkillSchema.extend({
  skillEffect: z.array(
    SkillEffectSchema.extend({
      skillCost: z.array(SkillCostSchema),
      skillYield: z.array(SkillYieldSchema),
    }),
  ),
});