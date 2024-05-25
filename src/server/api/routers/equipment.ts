import { type Prisma } from "@prisma/client";
// import { MonsterSchema } from "prisma/generated/zod";
// import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export type MainWeapon = Prisma.MainWeaponGetPayload<{
  include: {
    modifiersList: {
      include: {
        modifiers: true;
      };
    };
    crystal: {
      include: {
        modifiersList: {
          include: {
            modifiers: true;
          };
        };
        rates: true;
      };
    };
  };
}>;

export type SubWeapon = Prisma.SubWeaponGetPayload<{
    include: {
      modifiersList: {
        include: {
          modifiers: true;
        };
      }
  };
}>;

export type BodyArmor = Prisma.BodyArmorGetPayload<{
  include: {
    modifiersList: {
      include: {
        modifiers: true;
      };
    };
    crystal: {
      include: {
        modifiersList: {
          include: {
            modifiers: true;
          };
        };
        rates: true;
      };
    };
  };
}>;

export type AdditionalEquipment = Prisma.AdditionalEquipmentGetPayload<{
  include: {
    modifiersList: {
      include: {
        modifiers: true;
      };
    };
    crystal: {
      include: {
        modifiersList: {
          include: {
            modifiers: true;
          };
        };
        rates: true;
      };
    };
  };
}>;

export type SpecialEquipment = Prisma.SpecialEquipmentGetPayload<{
  include: {
    modifiersList: {
      include: {
        modifiers: true;
      };
    };
    crystal: {
      include: {
        modifiersList: {
          include: {
            modifiers: true;
          };
        };
        rates: true;
      };
    };
  };
}>;

// export const equipmentRouter = createTRPCRouter({
// });
