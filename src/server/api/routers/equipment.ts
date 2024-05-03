import type { Prisma } from "@prisma/client";

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
        raters: true;
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
        raters: true;
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
        raters: true;
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
        raters: true;
      };
    };
  };
}>;
