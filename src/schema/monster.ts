import { type ZodType } from "zod";
import { type Prisma } from "@prisma/client";
import { MonsterSchema } from "prisma/generated/zod";
import { StatisticsInputShcema, defaultStatistics, StatisticsInclude } from "./statistics";

export const MonsterInclude = {
    include: {
        statistics: StatisticsInclude,
    }
}

export type Monster = Prisma.MonsterGetPayload<typeof MonsterInclude>;

export const MonsterInputSchema = MonsterSchema.extend({
    statistics: StatisticsInputShcema,
}) satisfies ZodType<Monster>;

export const defaultMonster: Monster = {
  id: "",

  name: "",
  monsterType: "COMMON_BOSS",
  baseLv: 0,
  experience: 0,
  address: "",
  element: "NO_ELEMENT",
  radius: 1,
  maxhp: 0,
  physicalDefense: 0,
  physicalResistance: 0,
  magicalDefense: 0,
  magicalResistance: 0,
  criticalResistance: 0,
  avoidance: 0,
  dodge: 0,
  block: 0,
  normalAttackResistanceModifier: 0,
  physicalAttackResistanceModifier: 0,
  magicalAttackResistanceModifier: 0,
  difficultyOfTank: 5,
  difficultyOfMelee: 5,
  difficultyOfRanged: 5,
  possibilityOfRunningAround: 0,
  dataSources: "",
  extraDetails: "",

  updatedAt: new Date(),
  updatedByUserId: "",
  createdAt: new Date(),
  createdByUserId: "",
  statistics: defaultStatistics,
  statisticsId: null,
};