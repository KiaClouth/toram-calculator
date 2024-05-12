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

export type pTpye = {
  lv: number,
  str: number,
  int: number,
  vit: number,
  dex: number,
  agi: number,
  luk: number,
  tec: number,
  cri: number,
  men: number,
  mainWeaponType: MainWeaType,
  mainWeaponBaseAtk: number,
  mainWeaponRefinement: number,
  mainWeaponStability: number,
  subWeaponType: SubWeaType,
  subWeaponBaseAtk: number,
  subWeaponRefinement: number,
  subWeaponStability: number,
  bodyArmorType: BodyArmorType,
  bodyArmorBaseDef: number,
  bodyArmorRefinement: number,
  pPie: number,
  mPie: number,
  pStab: number,
  nDis: number,
  fDis: number,
  crT: number,
  cdT: number,
  weaMatkT: number,
  stro: number,
  unsheatheAtk: number,
  total: number,
  final: number,
  am: number,
  cm: number,
  aggro: number,
  maxHP: number,
  maxMP: number,
  pCr: number,
  pCd: number,
  mainWeaponAtk: number,
  subWeaponAtk: number,
  totalWeaponAtk: number,
  pAtk: number,
  mAtk: number,
  aspd: number,
  cspd: number,
  hp: number,
  mp: number,
  ampr: number
}

export type mType = {
  name: string,
  lv: number,
  hp: number,
  pDef: number,
  mDef: number,
  pRes: number,
  mRes: number,
  cRes: number
}

export type sType = {
  name: string,
  lv: number,
  am: number,
  cm: number
}

export type computerArgType = {
  p: pTpye;
  m: mType,
  s: sType,
  frame: number,
  skillIdex: number,
  skillFrame: number,
  vMatk: number,
  vPatk: number
}
