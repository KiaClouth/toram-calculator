
import { CrystalSchema } from "prisma/generated/zod";
import { type ZodType } from "zod";
import { ModifiersListInputSchema, defaultModifiersList, ModifiersListInclude } from "./modifiersList";
import { type Prisma } from "@prisma/client";
import { StatisticsInputShcema, defaultStatistics, StatisticsInclude } from "./statistics";

export const CrystalInclude = {
  include: {
    modifiersList: ModifiersListInclude,
    statistics: StatisticsInclude
  }
}

export type Crystal = Prisma.CrystalGetPayload<typeof CrystalInclude>;

export const CrystalInputSchema = CrystalSchema.extend({
  modifiersList: ModifiersListInputSchema,
  statistics: StatisticsInputShcema,
}) satisfies ZodType<Crystal>;

export const defaultCrystal: Crystal = {
  id: "",
  name: "",
  crystalType: "GENERAL",
  front: 0,
  modifiersList: defaultModifiersList,
  modifiersListId: defaultModifiersList.id,
  dataSources: "",
  extraDetails: "",

  updatedAt: new Date(),
  updatedByUserId: "",
  createdAt: new Date(),
  createdByUserId: "",
  statistics: defaultStatistics,
  statisticsId: "",
};
