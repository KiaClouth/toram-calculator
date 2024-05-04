import type { MainWeaType, SubWeaType, BodyArmorType } from "@prisma/client";

export type abiType = "str" | "int" | "vit" | "agi" | "dex" | "luk" | "tec" | "men" | "cri";

export type modifiers = {
  baseValue: number;
  modifiers: {
    static: {
      fixed: {
        value: number;
        origin: string;
      }[];
      percentage: {
        value: number;
        origin: string;
      }[];
    };
    dynamic: {
      fixed: {
        value: number;
        origin: string;
      }[];
      percentage: {
        value: number;
        origin: string;
      }[];
    };
  };
};

export interface CharacterState {
  systemAttributes: {
    // 系统数值：由系统决定基础值，玩家决定加成项的
    pPie: Omit<modifiers, "baseValue">;
    mPie: Omit<modifiers, "baseValue">;
    pStab: Omit<modifiers, "baseValue">;
    mStab: Omit<modifiers, "baseValue">;
    nDis: Omit<modifiers, "baseValue">;
    fDis: Omit<modifiers, "baseValue">;
    crT: Omit<modifiers, "baseValue">;
    cdT: Omit<modifiers, "baseValue">;
    stro: Omit<modifiers, "baseValue">;
    total: Omit<modifiers, "baseValue">;
    final: Omit<modifiers, "baseValue">;
    am: Omit<modifiers, "baseValue">;
  };
  primaryAttributes: {
    // 自由数值：玩家可定义基础值和加成项的，不由其他数值转化而来，但是会参与衍生属性计算的数值
    lv: number;
    abi: Record<abiType, modifiers>;
    equipment: {
      mainWeapon: {
        type: MainWeaType;
        baseAtk: modifiers;
        refinement: number;
        stability: number;
      };
      subWeapon: {
        type: SubWeaType;
        baseAtk: modifiers;
        refinement: number;
        stability: number;
      };
      BodyArmor: {
        type: BodyArmorType;
        baseDef: number;
        refinement: number;
      };
    };
  };
  derivedAttributes: {
    // 衍生属性：基础值自由数值决定，玩家只能定义加成项的
    maxHP: Omit<modifiers, "baseValue">;
    maxMP: Omit<modifiers, "baseValue">;
    pCr: Omit<modifiers, "baseValue">;
    pCd: Omit<modifiers, "baseValue">;
    mainWeaAtk: Omit<modifiers, "baseValue">;
    subWeaAtk: Omit<modifiers, "baseValue">;
    totalWeaMatk: Omit<modifiers, "baseValue">;
    pAtk: Omit<modifiers, "baseValue">;
    mAtk: Omit<modifiers, "baseValue">;
    aspd: Omit<modifiers, "baseValue">;
    cspd: Omit<modifiers, "baseValue">;
  };
}

export interface MonsterState {
  hp: number;
  pDef: number;
  pRes: number;
  mDef: number;
  mRes: number;
}
