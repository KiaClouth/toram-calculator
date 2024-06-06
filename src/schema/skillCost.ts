import { type ZodType } from "zod";
import { type Prisma } from "@prisma/client";
import { SkillCostSchema } from "prisma/generated/zod";

export const SkillCostInclude = {
  include: {
  }
}

export type SkillCost = Prisma.SkillCostGetPayload<typeof SkillCostInclude>;

export const SkillCostInputSchema = SkillCostSchema.extend({
}) satisfies ZodType<SkillCost>;

export const defaultSkillCost: SkillCost = {
  id: "",
  name: "MP Cost",
  costFormula: "",
  skillEffectId: null,
};