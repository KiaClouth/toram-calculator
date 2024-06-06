import { type Prisma } from "@prisma/client";
import { ComboSchema } from "prisma/generated/zod";
import { z, type ZodType } from "zod";
import { ComboStepInputSchema } from "./comboStep";

export const ComboInclude = {
  include: {
    comboStep: true,
  },
}

export type Combo = Prisma.ComboGetPayload<typeof ComboInclude>;

export const ComboInputSchema = ComboSchema.extend({
  comboStep: z.array(ComboStepInputSchema),
}) satisfies ZodType<Combo>;

export const defaultCombos: Combo = {
  id: "",
  name: null,
  comboStep: [],
  userCreateUserId: "",
};
