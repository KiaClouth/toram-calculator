import { type ZodType } from "zod";
import { type Prisma } from "@prisma/client";
import { UsageTimestampSchema } from "prisma/generated/zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// prisma数据结构定义
export const UsageTimestampInclude = {
  include: {},
};

// 静态类型声明
export type UsageTimestamp = Prisma.UsageTimestampGetPayload<typeof UsageTimestampInclude>;

// 动态类型声明
export const UsageTimestampInputSchema = UsageTimestampSchema.extend({

}) satisfies ZodType<UsageTimestamp>;

// 默认值定义
export const defaultUsageTimestamp: UsageTimestamp = {
  timestamp: new Date(),
  statisticsId: "",
};