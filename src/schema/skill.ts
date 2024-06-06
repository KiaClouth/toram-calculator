import { z, type ZodType } from "zod";
import { type Prisma } from "@prisma/client";
import { SkillSchema } from "prisma/generated/zod";
import { StatisticsInputShcema, defaultStatistics, StatisticsInclude } from "./statistics";
import { SkillEffectInclude, SkillEffectInputSchema, defaultSkillEffect } from "./skillEffect";

export const SkillInclude = {
    include: {
        skillEffect: SkillEffectInclude,
        statistics: StatisticsInclude,
    }
}

export type Skill = Prisma.SkillGetPayload<typeof SkillInclude>;

export const SkillInputSchema = SkillSchema.extend({
    skillEffect: z.array(SkillEffectInputSchema),
    statistics: z.nullable(StatisticsInputShcema),
}) satisfies ZodType<Skill>;

export const defaultSkill: Skill = {
    id: "",
    name: "",
    skillDescription: "",
    skillTreeName: "BLADE",
    skillType: "ACTIVE_SKILL",
    weaponElementDependencyType: "TRUE",
    element: "NO_ELEMENT",
    skillEffect: [defaultSkillEffect],
    dataSources: "",
    extraDetails: "",
  
    updatedAt: new Date(),
    updatedByUserId: "",
    createdAt: new Date(),
    createdByUserId: "",
    statistics: defaultStatistics,
    statisticsId: null,
  };