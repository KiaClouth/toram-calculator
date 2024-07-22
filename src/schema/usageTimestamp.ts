import { type ZodType } from "zod";
import { type Prisma } from "@prisma/client";
import { UsageTimestampSchema } from "prisma/generated/zod";

export const usageTimestampInclude = {
  include: {},
};

export type UsageTimestamp = Prisma.UsageTimestampGetPayload<typeof usageTimestampInclude>;

export const UsageTimestampInputSchema = UsageTimestampSchema.extend({

}) satisfies ZodType<UsageTimestamp>;

export const defaultUsageTimestamp: UsageTimestamp = {
  timestamp: new Date(),
  statisticsId: null,
};
