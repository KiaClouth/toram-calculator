import { AdditionalEquipmentSchema } from "prisma/generated/zod";
import { z, type ZodType } from "zod";
import { CrystalInclude, CrystalInputSchema, defaultCrystal } from "./crystal";
import { ModifiersListInputSchema, defaultModifiersList, ModifiersListInclude } from "./modifiersList";
import { type Prisma } from "@prisma/client";
import { StatisticsInputShcema, defaultStatistics, StatisticsInclude } from "./statistics";

export const AdditionalEquipmentInclude = {
  include: {
    crystal: CrystalInclude,
    modifiersList: ModifiersListInclude,
    statistics: StatisticsInclude,
  },
}

export type AdditionalEquipment = Prisma.AdditionalEquipmentGetPayload<typeof AdditionalEquipmentInclude>;

export const AdditionalEquipmentInputSchema = AdditionalEquipmentSchema.extend({
  modifiersList: ModifiersListInputSchema,
  crystal: z.array(CrystalInputSchema),
  statistics: StatisticsInputShcema,
}) satisfies ZodType<AdditionalEquipment>;

export const defaultAdditionalEquipment: AdditionalEquipment = {
  id: "",
  name: "",
  refinement: 0,
  crystal: [defaultCrystal],
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
