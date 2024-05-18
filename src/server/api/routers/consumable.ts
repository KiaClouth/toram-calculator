import type { Prisma } from "@prisma/client";

export type Consumable = Prisma.ConsumableGetPayload<{
  include: {
      modifiersList: {
        include: {
          modifiers: true;
        };
      }
        rates: true;
  };
}>;