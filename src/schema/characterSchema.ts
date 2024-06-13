import { type Prisma } from "@prisma/client";
import { CharacterSchema } from "prisma/generated/zod";
import { type ZodType, z } from "zod";
import { AdditionalEquipmentInclude, AdditionalEquipmentInputSchema, defaultAdditionalEquipment } from "./additionalEquipment";
import { BodyArmorInclude, BodyArmorInputSchema, defaultBodyArmor } from "./bodyArmor";
import { ComboInclude, ComboInputSchema } from "./combo";
import { ConsumableInclude, ConsumableInputSchema, defaultConsumable } from "./consumable";
import { MainWeaponInclude, MainWeaponInputSchema, defaultMainWeapon } from "./mainWeapon";
import { ModifiersListInputSchema, defaultModifiersList, ModifiersListInclude } from "./modifiersList";
import { PetInclude, PetInputSchema, defaultPet } from "./pet";
import { SpecialEquipmentInclude, SpecialEquipmentInputSchema, defaultSpecialEquipment } from "./specialEquipment";
import { SubWeaponInclude, SubWeaponInputSchema, defaultSubWeapon } from "./subWeapon";
import { SkillInclude, SkillInputSchema, defaultSkill } from "./skill";
import { StatisticsInputShcema, defaultStatistics, StatisticsInclude } from "./statistics";

export const CharacterInclude = {
  include: {
    mainWeapon: MainWeaponInclude,
    subWeapon: SubWeaponInclude,
    bodyArmor: BodyArmorInclude,
    additionalEquipment: AdditionalEquipmentInclude,
    specialEquipment: SpecialEquipmentInclude,
    fashion: ModifiersListInclude,
    cuisine: ModifiersListInclude,
    pet: PetInclude,
    modifiersList: ModifiersListInclude,
    skillList: SkillInclude,
    consumableList: ConsumableInclude,
    combos: ComboInclude,
    statistics: StatisticsInclude,
  },
}

export type Character = Prisma.CharacterGetPayload<typeof CharacterInclude>;

export const CharacterInputSchema = CharacterSchema.extend({
  mainWeapon: MainWeaponInputSchema,
  subWeapon: SubWeaponInputSchema,
  bodyArmor: BodyArmorInputSchema,
  additionalEquipment: AdditionalEquipmentInputSchema,
  specialEquipment: SpecialEquipmentInputSchema,
  fashion: ModifiersListInputSchema,
  cuisine: ModifiersListInputSchema,
  pet: PetInputSchema,
  skillList: z.array(SkillInputSchema),
  consumableList: z.array(ConsumableInputSchema),
  combos: z.array(ComboInputSchema),
  modifiersList: ModifiersListInputSchema,
  statistics: StatisticsInputShcema,
}) satisfies ZodType<Character>;

export const defaultCharacter: Character = {
  id: "",
  characterType: "Tank",
  name: "",
  lv: 0,
  baseStr: 0,
  baseInt: 0,
  baseVit: 0,
  baseAgi: 0,
  baseDex: 0,
  specialAbiType: "NULL",
  specialAbiValue: 0,
  mainWeapon: defaultMainWeapon,
  mainWeaponId: "",
  subWeapon: defaultSubWeapon,
  subWeaponId: "",
  bodyArmor: defaultBodyArmor,
  bodyArmorId: "",
  additionalEquipment: defaultAdditionalEquipment,
  additionalEquipmentId: "",
  specialEquipment: defaultSpecialEquipment,
  specialEquipmentId: "",
  fashion: defaultModifiersList,
  fashionModifiersListId: "", 
  cuisine: defaultModifiersList,
  CuisineModifiersListId: "",
  consumableList: [defaultConsumable],
  skillList: [defaultSkill],
  combos: [],
  pet: defaultPet,
  petId: defaultPet.id,
  modifiersList: defaultModifiersList,
  modifiersListId: defaultModifiersList.id,
  extraDetails: "",

  updatedAt: new Date(),
  updatedByUserId: "",
  createdAt: new Date(),
  createdByUserId: "",
  statistics: defaultStatistics,
  statisticsId: null,
};
