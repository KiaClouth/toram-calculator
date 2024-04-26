import type { Prisma } from "@prisma/client";

export type MainWeapon = Prisma.MainWeaponGetPayload<{
    include: {
      crystal: true;
  };
}>;

export type SubWeapon = Prisma.SubWeaponGetPayload<{
    include: object
}>

export type BodyArmor = Prisma.BodyArmorGetPayload<{
    include: {
        crystal: true;
    };
}>

export type AdditionalEquipment = Prisma.AdditionalEquipmentGetPayload<{
    include: {
        crystal: true;
    };
}>

export type SpecialEquipment = Prisma.SpecialEquipmentGetPayload<{
    include: {
        crystal: true;
    };
}>