import { type Prisma } from "@prisma/client";
import { ModifierSchema, ModifiersListSchema } from "prisma/generated/zod";
import { type ZodType, z } from "zod";
import { ModifierInclude, defauleModifier } from "./modifier";

export const ModifiersListInclude = {
    include: {
        modifiers: ModifierInclude,
    }
};

export type ModifiersList = Prisma.ModifiersListGetPayload<typeof ModifiersListInclude>

export const ModifiersListInputSchema = ModifiersListSchema.extend({
    modifiers: z.array(ModifierSchema),
}) satisfies ZodType<ModifiersList>;

export const defaultModifiersList: ModifiersList = {
  id: "",
  name: "SYSTEM",
  modifiers: [defauleModifier],
};