
import { MonsterSchema, RateSchema } from "prisma/generated/zod";
import { z } from "zod";

export const MonsterInputSchema = MonsterSchema.extend({
    raters: z.array(RateSchema),
});