import { type ZodType } from "zod";
import { type Prisma } from "@prisma/client";
import { SkillYieldSchema } from "prisma/generated/zod";

export const SkillYieldInclude = {
  include: {
  }
}

export type SkillYield = Prisma.SkillYieldGetPayload<typeof SkillYieldInclude>;

export const SkillYieldInputSchema = SkillYieldSchema.extend({
}) satisfies ZodType<SkillYield>;

export const defaultSkillYield: SkillYield = {
  id: "",
  name: "",
  yieldType: "ImmediateEffect",
  mutationTimingFormula: "",
  yieldFormula: "",
  skillEffectId: null,
};