import { type ZodType } from "zod";
import { type Prisma } from "@prisma/client";
import { ViewTimestampSchema } from "prisma/generated/zod";

export const viewTimestampInclude = {
  include: {},
};

export type ViewTimestamp = Prisma.ViewTimestampGetPayload<typeof viewTimestampInclude>;

export const ViewTimestampInputSchema = ViewTimestampSchema.extend({

}) satisfies ZodType<ViewTimestamp>;

export const defaultViewTimestamp: ViewTimestamp = {
  timestamp: new Date(),
  statisticsId: null,
};
