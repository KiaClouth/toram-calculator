import { type ZodType, z } from "zod";
import { type Prisma } from "@prisma/client";
import { RateSchema, StatisticsSchema } from "prisma/generated/zod";
import { defaultRate, rateInclude } from "./rate";

export const StatisticsInclude = {
    include: {
        rates: rateInclude,
    }
};

export type Statistics = Prisma.StatisticsGetPayload<typeof StatisticsInclude>;

export const StatisticsInputShcema = StatisticsSchema.extend({
    rates: z.array(RateSchema),
}) satisfies ZodType<Statistics>;

export const defaultStatistics: Statistics = {
  id: "",
  rates: [defaultRate],
  viewCount: 0,
  usageCount: 0,
  usageTimestamps: [],
  viewTimestamps: [],

  monsterId: null,
  crystalId: null,
  mainWeaponId: null,
  subWeaponId: null,
  bodyArmorId: null,
  additionalEquipmentId: null,
  specialEquipmentId: null,
  skillId: null,
  petId: null,
  consumableId: null,
  characterId: null,
  analyzerId: null
};