import { SkillSchema, SkillEffectSchema, SkillCostSchema, SkillYieldSchema } from "prisma/generated/zod";
import { z } from "zod";

// 在传入参数里声明不需要关系字段，然后在上传api中补充关系字段

export const SkillEffectInputSchema = SkillEffectSchema.extend({
  skillCost: z.array(SkillCostSchema.omit({ id: true, skillEffectId: true })),
  skillYield: z.array(SkillYieldSchema.omit({ id: true, skillEffectId: true })),
});

export const SkillInputSchema = SkillSchema.extend({
  skillEffect: z.array(
    SkillEffectInputSchema.omit({
      belongToskillId: true,
      id: true,
    }),
  ),
});
