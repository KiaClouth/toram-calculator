import { type ZodType, z } from "zod";
import { type Prisma } from "@prisma/client";
import { StatisticsSchema } from "prisma/generated/zod";
import { defaultRate, rateInclude, RateInputSchema } from "./rate";
import { defaultUsageTimestamp, UsageTimestampInclude, UsageTimestampInputSchema } from "./usageTimestamp";
import { defaultViewTimestamp, ViewTimestampInclude, ViewTimestampInputSchema } from "./viewTimestamp";

// prisma数据结构定义
export const StatisticsInclude = {
  include: {
    rates: rateInclude,
    usageTimestamps: UsageTimestampInclude,
    viewTimestamps: ViewTimestampInclude,
  },
};

// 静态类型声明
export type Statistics = Prisma.StatisticsGetPayload<typeof StatisticsInclude>;

// 动态类型声明
export const StatisticsInputSchema = StatisticsSchema.extend({
  rates: z.array(RateInputSchema),
  usageTimestamps: z.array(UsageTimestampInputSchema),
  viewTimestamps: z.array(ViewTimestampInputSchema),
}) satisfies ZodType<Statistics>;

// 默认值定义
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
