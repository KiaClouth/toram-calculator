import { z, type ZodType } from "zod";
import { type Prisma } from "@prisma/client";
import { SkillEffectSchema } from "prisma/generated/zod";
import { SkillCostInclude, SkillCostInputSchema, defaultSkillCost } from "./skillCost";
import { SkillYieldInclude, SkillYieldInputSchema, defaultSkillYield } from "./skillYield";

export const SkillEffectInclude = {
    include: {
        skillCost: SkillCostInclude,
        skillYield: SkillYieldInclude
    }
}

export type SkillEffect = Prisma.SkillEffectGetPayload<typeof SkillEffectInclude>;

export const SkillEffectInputSchema = SkillEffectSchema.extend({
    skillCost: z.array(SkillCostInputSchema),
    skillYield: z.array(SkillYieldInputSchema),
}) satisfies ZodType<SkillEffect>;

export const defaultSkillEffect: SkillEffect = {
  id: "",
  condition: "",
  description: "",
  actionBaseDurationFormula: "13",
  actionModifiableDurationFormula: "48",
  skillExtraActionType: "None",
  chargingBaseDurationFormula: "0",
  chargingModifiableDurationFormula: "0",
  chantingBaseDurationFormula: "0",
  chantingModifiableDurationFormula: "0",
  skillStartupFramesFormula: "0",
  skillCost: [defaultSkillCost],
  skillYield: [defaultSkillYield],
  belongToskillId: "",
};