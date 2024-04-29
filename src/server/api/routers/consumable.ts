import type { Prisma } from "@prisma/client";

export type Consumable = Prisma.ConsumableGetPayload<{
    include: {
        raters: true;
  };
}>;