import { type ZodType, z } from "zod";
import { type Prisma } from "@prisma/client";
import { StatisticsSchema } from "prisma/generated/zod";
import { defaultRate, rateInclude, RateInputSchema } from "./rate";
import { defaultUsageTimestamp, usageTimestampInclude, UsageTimestampInputSchema } from "./usageTimestamp";
import { defaultViewTimestamp, viewTimestampInclude, ViewTimestampInputSchema } from "./viewTimestamp";

export const StatisticsInclude = {
    include: {
        rates: rateInclude,
        usageTimestamps: usageTimestampInclude,
        viewTimestamps: viewTimestampInclude
    }
};

export type Statistics = Prisma.StatisticsGetPayload<typeof StatisticsInclude>;

export const StatisticsInputSchema = StatisticsSchema.extend({
    rates: z.array(RateInputSchema),
    usageTimestamps: z.array(UsageTimestampInputSchema),
    viewTimestamps: z.array(ViewTimestampInputSchema)
}) satisfies ZodType<Statistics>;

export const defaultStatistics: Statistics = {
  id: "",
  usageTimestamps: [defaultUsageTimestamp],
  viewTimestamps: [defaultViewTimestamp],
    rates: [defaultRate],
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
    analyzerId: null,
};