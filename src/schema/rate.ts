import { type ZodType } from "zod";
import { type Prisma } from "@prisma/client";
import { RateSchema } from "prisma/generated/zod";

export const rateInclude = {
  include: {
    
  }
};

export type Rate = Prisma.RateGetPayload<typeof rateInclude>;

export const RateInputSchema = RateSchema.extend({
    
}) satisfies ZodType<Rate>;

export const defaultRate: Rate = {
  id: "",
  rate: 0,
  userId: "",
  statisticsId: ""
};