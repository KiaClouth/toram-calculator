import type { Prisma } from "@prisma/client";

export type Pet = Prisma.PetGetPayload<{
    include: {
        raters: true;
  };
}>;