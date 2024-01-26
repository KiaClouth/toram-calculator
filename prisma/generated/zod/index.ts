import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image']);

export const PostScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt','createdById']);

export const MonsterScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','updatedById','state','name','type','baseLv','experience','address','element','radius','maxhp','physicalDefense','physicalResistance','magicalDefense','magicalResistance','criticalResistance','avoidance','dodge','block','normalAttackResistanceModifier','physicalAttackResistanceModifier','magicalAttackResistanceModifier','difficultyOfTank','difficultyOfMelee','difficultyOfRanged','possibilityOfRunningAround','specialBehavior']);

export const ModifiersScalarFieldEnumSchema = z.enum(['id','name','valueType','value','usedById']);

export const ModifiersListScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name','usedByMainWeaponId','cuisineId','subWeaponId','bodyArmorId','additionalEquipmentId','specialEquipmentId','consumablesId','fashionId','characterId']);

export const CharacterScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','createdById','state','name','lv']);

export const BaseAbiScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','createdByCharacter','baseStr','baseInt','baseVit','baseAgi','baseDex','baseLuc','baseCri','baseTec','baseMen']);

export const EquipmentScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','createdById']);

export const MainWeaponScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','createdById','state','name','mainWeaType','baseAtk','refinement','stability','dte']);

export const SubWeaponScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','createdById','state','name','subWeaType','baseAtk','refinement','stability','dte']);

export const BodyArmorScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','createdById','state','type','name','refinement']);

export const AdditionalEquipmentScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','createdById','state','name','refinement']);

export const SpecialEquipmentScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','createdById','state']);

export const FashionScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','createdById']);

export const CuisineScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','createdById']);

export const ConsumablesScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','createdById','state','name']);

export const SkillScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','createdById','state','name']);

export const PetScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','createdById','state','name']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires','lastPage']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullsOrderSchema = z.enum(['first','last']);

export const StateSchema = z.enum(['PRIVATE','PUBLIC']);

export type StateType = `${z.infer<typeof StateSchema>}`

export const ElementSchema = z.enum(['NO_ELEMENT','LIGHT','DARK','WATER','FIRE','EARTH','WIND']);

export type ElementType = `${z.infer<typeof ElementSchema>}`

export const MonsterTypeSchema = z.enum(['COMMON_MOBS','COMMON_MINI_BOSS','COMMON_BOSS','EVENT_MOBS','EVENT_MINI_BOSS','EVENT_BOSS']);

export type MonsterTypeType = `${z.infer<typeof MonsterTypeSchema>}`

export const ModifiersValueTypeSchema = z.enum(['FLAT_BONUS','PERCENTAGE_BONUS']);

export type ModifiersValueTypeType = `${z.infer<typeof ModifiersValueTypeSchema>}`

export const ModifiersNameSchema = z.enum(['STR','INT','VIT','AGI','DEX','PHYSICAL_ATK','MAGICAL_ATK','WEAPON_ATK','UNSHEATHE_ATK','PHYSICAL_PIERCE','MAGICAL_PIERCE','CRITICAL_RATE','CRITICAL_DAMAGE','MAGIC_CRT_CONVERSION_RATE','MAGIC_CRT_DAMAGE_CONVERSION_RATE','SHORT_RANGE_DAMAGE','LONG_RANGE_DAMAGE','STRONGER_AGAINST_NETURAL','STRONGER_AGAINST_LIGHT','STRONGER_AGAINST_DARK','STRONGER_AGAINST_WATER','STRONGER_AGAINST_FIRE','STRONGER_AGAINST_EARTH','STRONGER_AGAINST_WIND','STABILITY','ACCURACY','ADDITIONAL_PHYSICS','ADDITIONAL_MAGIC','ANTICIPATE','GUARD_BREAK','REFLECT','ABSOLUTA_ACCURACY','ATK_UP_STR','ATK_UP_INT','ATK_UP_VIT','ATK_UP_AGI','ATK_UP_DEX','MATK_UP_STR','MATK_UP_INT','MATK_UP_VIT','MATK_UP_AGI','MATK_UP_DEX','ATK_DOWN_STR','ATK_DOWN_INT','ATK_DOWN_VIT','ATK_DOWN_AGI','ATK_DOWN_DEX','MATK_DOWN_STR','MATK_DOWN_INT','MATK_DOWN_VIT','MATK_DOWN_AGI','MATK_DOWN_DEX','PHYSICAL_DEF','MAGICAL_DEF','PHYSICAL_RESISTANCE','MAGICAL_RESISTANCE','NEUTRAL_RESISTANCE','LIGHT_RESISTANCE','DARK_RESISTANCE','WATER_RESISTANCE','FIRE_RESISTANCE','EARTH_RESISTANCE','WIND_RESISTANCE','DODGE','AILMENT_RESISTANCE','BASE_GUARD_POWER','GUARD_POWER','BASE_GUARD_RECHARGE','GUARD_RECHANGE','EVASION_RECHARGE','PHYSICAL_BARRIER','MAGICAL_BARRIER','FRACTIONAL_BARRIER','BARRIER_COOLDOWN','REDUCE_DMG_FLOOR','REDUCE_DMG_METEOR','REDUCE_DMG_PLAYER_EPICENTER','REDUCE_DMG_FOE_EPICENTER','REDUCE_DMG_BOWLING','REDUCE_DMG_BULLET','REDUCE_DMG_STRAIGHT_LINE','REDUCE_DMG_CHARGE','ABSOLUTE_DODGE','ASPD','CSPD','MSPD','MAX_HP','MAX_MP','AGGRO','WEAPON_RANGE','DROP_RATE','NATYRAL_HP_REGEN','NATURAL_MP_REGEN','REVIVE_TIME','FLINCH_UNAVAILABLE','TUMBLE_UNAVAILABLE','STUN_UNAVAILABLE','INVINCIBLE_AID','EXP_RATE','PET_EXP','ITEM_COOLDOWN','RECOIL_DAMAGE','GEM_POWDER_DROP']);

export type ModifiersNameType = `${z.infer<typeof ModifiersNameSchema>}`

export const MainWeaTypeSchema = z.enum(['NO_WEAPOEN','ONE_HAND_SWORD','TWO_HANDS_SWORD','BOW','STAFF','MAGIC_DEVICE','KNUCKLE','HALBERD','KATANA']);

export type MainWeaTypeType = `${z.infer<typeof MainWeaTypeSchema>}`

export const SubWeaTypeSchema = z.enum(['NO_WEAPOEN','ONE_HAND_SWORD','MAGIC_DEVICE','KNUCKLE','KATANA','ARROW','DAGGER','NINJUTSUSCROLL','SHIELD']);

export type SubWeaTypeType = `${z.infer<typeof SubWeaTypeSchema>}`

export const BodyArmorTypeSchema = z.enum(['NORMAL','LIGHT','HEAVY']);

export type BodyArmorTypeType = `${z.infer<typeof BodyArmorTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  // omitted: id: z.string().cuid(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  emailVerified: z.coerce.date().nullish(),
  image: z.string().nullish(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// POST SCHEMA
/////////////////////////////////////////

export const PostSchema = z.object({
  // omitted: id: z.number().int(),
  name: z.string(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  // omitted: createdById: z.string(),
})

export type Post = z.infer<typeof PostSchema>

/////////////////////////////////////////
// MONSTER SCHEMA
/////////////////////////////////////////

export const MonsterSchema = z.object({
  state: StateSchema,
  type: MonsterTypeSchema.nullish(),
  element: ElementSchema.nullish(),
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  // omitted: updatedById: z.string(),
  name: z.string(),
  baseLv: z.number().int().nullish(),
  experience: z.number().int().nullish(),
  address: z.string().nullish(),
  radius: z.number().int().nullish(),
  maxhp: z.number().int().nullish(),
  physicalDefense: z.number().int().nullish(),
  physicalResistance: z.number().int().nullish(),
  magicalDefense: z.number().int().nullish(),
  magicalResistance: z.number().int().nullish(),
  criticalResistance: z.number().int().nullish(),
  avoidance: z.number().int().nullish(),
  dodge: z.number().int().nullish(),
  block: z.number().int().nullish(),
  normalAttackResistanceModifier: z.number().int().nullish(),
  physicalAttackResistanceModifier: z.number().int().nullish(),
  magicalAttackResistanceModifier: z.number().int().nullish(),
  difficultyOfTank: z.number().int(),
  difficultyOfMelee: z.number().int(),
  difficultyOfRanged: z.number().int(),
  possibilityOfRunningAround: z.number().int(),
  specialBehavior: z.string().nullish(),
})

export type Monster = z.infer<typeof MonsterSchema>

/////////////////////////////////////////
// MODIFIERS SCHEMA
/////////////////////////////////////////

export const ModifiersSchema = z.object({
  name: ModifiersNameSchema,
  valueType: ModifiersValueTypeSchema,
  // omitted: id: z.string().cuid(),
  value: z.number().int(),
  usedById: z.string().nullish(),
})

export type Modifiers = z.infer<typeof ModifiersSchema>

/////////////////////////////////////////
// MODIFIERS LIST SCHEMA
/////////////////////////////////////////

export const ModifiersListSchema = z.object({
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  name: z.string().nullish(),
  usedByMainWeaponId: z.string(),
  cuisineId: z.string().nullish(),
  subWeaponId: z.string().nullish(),
  bodyArmorId: z.string().nullish(),
  additionalEquipmentId: z.string().nullish(),
  specialEquipmentId: z.string().nullish(),
  consumablesId: z.string().nullish(),
  fashionId: z.string().nullish(),
  characterId: z.string().nullish(),
})

export type ModifiersList = z.infer<typeof ModifiersListSchema>

/////////////////////////////////////////
// CHARACTER SCHEMA
/////////////////////////////////////////

export const CharacterSchema = z.object({
  state: StateSchema,
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  // omitted: createdById: z.string(),
  name: z.string(),
  lv: z.number().int(),
})

export type Character = z.infer<typeof CharacterSchema>

/////////////////////////////////////////
// BASE ABI SCHEMA
/////////////////////////////////////////

export const BaseAbiSchema = z.object({
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  // omitted: createdByCharacter: z.string(),
  baseStr: z.number().int(),
  baseInt: z.number().int(),
  baseVit: z.number().int(),
  baseAgi: z.number().int(),
  baseDex: z.number().int(),
  baseLuc: z.number().int(),
  baseCri: z.number().int(),
  baseTec: z.number().int(),
  baseMen: z.number().int(),
})

export type BaseAbi = z.infer<typeof BaseAbiSchema>

/////////////////////////////////////////
// EQUIPMENT SCHEMA
/////////////////////////////////////////

export const EquipmentSchema = z.object({
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  // omitted: createdById: z.string(),
})

export type Equipment = z.infer<typeof EquipmentSchema>

/////////////////////////////////////////
// MAIN WEAPON SCHEMA
/////////////////////////////////////////

export const MainWeaponSchema = z.object({
  state: StateSchema,
  mainWeaType: MainWeaTypeSchema,
  dte: ElementSchema,
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  createdById: z.string().nullish(),
  name: z.string(),
  baseAtk: z.number().int(),
  refinement: z.number().int(),
  stability: z.number().int(),
})

export type MainWeapon = z.infer<typeof MainWeaponSchema>

/////////////////////////////////////////
// SUB WEAPON SCHEMA
/////////////////////////////////////////

export const SubWeaponSchema = z.object({
  state: StateSchema,
  subWeaType: SubWeaTypeSchema,
  dte: ElementSchema,
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  createdById: z.string().nullish(),
  name: z.string(),
  baseAtk: z.number().int(),
  refinement: z.number().int(),
  stability: z.number().int(),
})

export type SubWeapon = z.infer<typeof SubWeaponSchema>

/////////////////////////////////////////
// BODY ARMOR SCHEMA
/////////////////////////////////////////

export const BodyArmorSchema = z.object({
  state: StateSchema,
  type: BodyArmorTypeSchema,
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  createdById: z.string().nullish(),
  name: z.string(),
  refinement: z.number().int(),
})

export type BodyArmor = z.infer<typeof BodyArmorSchema>

/////////////////////////////////////////
// ADDITIONAL EQUIPMENT SCHEMA
/////////////////////////////////////////

export const AdditionalEquipmentSchema = z.object({
  state: StateSchema,
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  createdById: z.string().nullish(),
  name: z.string(),
  refinement: z.number().int(),
})

export type AdditionalEquipment = z.infer<typeof AdditionalEquipmentSchema>

/////////////////////////////////////////
// SPECIAL EQUIPMENT SCHEMA
/////////////////////////////////////////

export const SpecialEquipmentSchema = z.object({
  state: StateSchema,
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  createdById: z.string().nullish(),
})

export type SpecialEquipment = z.infer<typeof SpecialEquipmentSchema>

/////////////////////////////////////////
// FASHION SCHEMA
/////////////////////////////////////////

export const FashionSchema = z.object({
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  createdById: z.string().nullish(),
})

export type Fashion = z.infer<typeof FashionSchema>

/////////////////////////////////////////
// CUISINE SCHEMA
/////////////////////////////////////////

export const CuisineSchema = z.object({
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  createdById: z.string().nullish(),
})

export type Cuisine = z.infer<typeof CuisineSchema>

/////////////////////////////////////////
// CONSUMABLES SCHEMA
/////////////////////////////////////////

export const ConsumablesSchema = z.object({
  state: StateSchema,
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  createdById: z.string().nullish(),
  name: z.string().nullish(),
})

export type Consumables = z.infer<typeof ConsumablesSchema>

/////////////////////////////////////////
// SKILL SCHEMA
/////////////////////////////////////////

export const SkillSchema = z.object({
  state: StateSchema,
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  createdById: z.string().nullish(),
  name: z.string().nullish(),
})

export type Skill = z.infer<typeof SkillSchema>

/////////////////////////////////////////
// PET SCHEMA
/////////////////////////////////////////

export const PetSchema = z.object({
  state: StateSchema,
  // omitted: id: z.string().cuid(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
  createdById: z.string().nullish(),
  name: z.string().nullish(),
})

export type Pet = z.infer<typeof PetSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  // omitted: id: z.string().cuid(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullish(),
  access_token: z.string().nullish(),
  expires_at: z.number().int().nullish(),
  token_type: z.string().nullish(),
  scope: z.string().nullish(),
  id_token: z.string().nullish(),
  session_state: z.string().nullish(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  // omitted: id: z.string().cuid(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  lastPage: z.string(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>
