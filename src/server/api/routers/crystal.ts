import type { Prisma } from "@prisma/client";

export type Modifier = Prisma.ModifierGetPayload<{
    include: object;
}>

export type ModifiersList = Prisma.ModifiersListGetPayload<{
    include: {
        modifiers: true;
    };
}>

export type Crystal = Prisma.CrystalGetPayload<{
    include: {
        raters: true;
  };
}>;