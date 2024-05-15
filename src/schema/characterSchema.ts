import {
  AdditionalEquipmentSchema,
  CharacterSchema,
  ComboSchema,
  ComboStepSchema,
  ConsumableSchema,
  MainWeaponSchema,
  ModifierSchema,
  ModifiersListSchema,
  PetSchema,
  SpecialEquipmentSchema,
} from "prisma/generated/zod";
import { z } from "zod";
import { CrystalInputSchema } from "./crystalSchema";

export const ModifierInputSchema = ModifierSchema.extend({});

export const ModifiersListInputSchema = ModifiersListSchema.extend({
  modifiers: z.array(ModifierInputSchema),
});

export const MainWeaponInputSchema = MainWeaponSchema.extend({
  modifiersList: ModifiersListInputSchema,
  crystal: CrystalInputSchema,
});

export const SubWeaponInputSchema = MainWeaponInputSchema.extend({
  modifiersList: ModifiersListInputSchema,
});

export const BodyArmorInputSchema = MainWeaponInputSchema.extend({
  modifiersList: ModifiersListInputSchema,
  crystal: CrystalInputSchema,
});

export const AdditionalEquipmentInputSchema = AdditionalEquipmentSchema.extend({
  modifiersList: ModifiersListInputSchema,
  crystal: CrystalInputSchema,
});

export const SpecialEquipmentInputSchema = SpecialEquipmentSchema.extend({
  modifiersList: ModifiersListInputSchema,
  crystal: CrystalInputSchema,
});

export const ConsumablesInputSchema = ConsumableSchema.extend({
  modifiersList: ModifiersListInputSchema,
});

export const PetInputSchema = PetSchema.extend({});

export const ComboStepsInputSchema = ComboStepSchema.extend({});

export const ComboInputSchema = ComboSchema.extend({
  comboStep: z.array(ComboStepsInputSchema),
});

export const CharacterInputSchema = CharacterSchema.extend({
  combos: z.array(ComboInputSchema),
  pet: PetInputSchema,
  modifiersList: ModifiersListInputSchema,
});
