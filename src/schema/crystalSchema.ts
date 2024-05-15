import { CrystalSchema } from "prisma/generated/zod";
import { ModifiersInputSchema } from "./characterSchema";

export const CrystalInputSchema = CrystalSchema.extend({
    modifiersList: ModifiersInputSchema,
})