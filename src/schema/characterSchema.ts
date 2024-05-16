import {
  AdditionalEquipmentSchema,
  BodyArmorSchema,
  CharacterSchema,
  ComboSchema,
  ComboStepSchema,
  ConsumableSchema,
  MainWeaponSchema,
  ModifierSchema,
  ModifiersListSchema,
  PetSchema,
  SpecialEquipmentSchema,
  SubWeaponSchema,
} from "prisma/generated/zod";
import { z } from "zod";
import { CrystalInputSchema } from "./crystalSchema";
import { SkillInputSchema } from "./skillSchema";

export const ModifierInputSchema = ModifierSchema.extend({});

export const ModifiersListInputSchema = ModifiersListSchema.extend({
  modifiers: z.array(ModifierInputSchema),
});

export const MainWeaponInputSchema = MainWeaponSchema.extend({
  modifiersList: ModifiersListInputSchema,
  crystal: z.array(CrystalInputSchema),
});

export const SubWeaponInputSchema = SubWeaponSchema.extend({
  modifiersList: ModifiersListInputSchema,
});

export const BodyArmorInputSchema = BodyArmorSchema.extend({
  modifiersList: ModifiersListInputSchema,
  crystal: z.array(CrystalInputSchema),
});

export const AdditionalEquipmentInputSchema = AdditionalEquipmentSchema.extend({
  modifiersList: ModifiersListInputSchema,
  crystal: z.array(CrystalInputSchema),
});

export const SpecialEquipmentInputSchema = SpecialEquipmentSchema.extend({
  modifiersList: ModifiersListInputSchema,
  crystal: z.array(CrystalInputSchema),
});

export const ConsumableInputSchema = ConsumableSchema.extend({
  modifiersList: ModifiersListInputSchema,
});

export const PetInputSchema = PetSchema.extend({});

export const ComboStepsInputSchema = ComboStepSchema.extend({});

export const ComboInputSchema = ComboSchema.extend({
  comboStep: z.array(ComboStepsInputSchema),
});

//     mainWeapon             MainWeapon          @relation(fields: [mainWeaponId], references: [id])
//     subWeapon              SubWeapon           @relation(fields: [subWeaponId], references: [id])
//     bodyArmor              BodyArmor           @relation(fields: [bodyArmorId], references: [id])
//     additionalEquipment    AdditionalEquipment @relation(fields: [additionalEquipmentId], references: [id])
//     specialEquipment       SpecialEquipment    @relation(fields: [specialEquipmentId], references: [id])
//     fashion                ModifiersList       @relation("FashionRelation", fields: [fashionModifiersListId], references: [id])
//     cuisine                ModifiersList       @relation("CuisineRelation", fields: [CuisineModifiersListId], references: [id])
//     pet                    Pet                 @relation(fields: [petId], references: [id])
//     modifiersList          ModifiersList       @relation("ModifiersListRelation", fields: [modifiersListId], references: [id])
//     skillList              Skill[]
//     consumableList         Consumable[]
//     combos                 Combo[]

export const CharacterInputSchema = CharacterSchema.extend({
  mainWeapon: MainWeaponInputSchema,
  subWeapon: SubWeaponInputSchema,
  bodyArmor: BodyArmorInputSchema,
  additionalEquipment: AdditionalEquipmentInputSchema,
  specialEquipment: SpecialEquipmentInputSchema,
  fashion: ModifiersListInputSchema,
  cuisine: ModifiersListInputSchema,
  pet: PetInputSchema,
  modifiersList: ModifiersListInputSchema,
  skillList: z.array(SkillInputSchema),
  consumableList: z.array(ConsumableInputSchema),
  combos: z.array(ComboInputSchema),
});
