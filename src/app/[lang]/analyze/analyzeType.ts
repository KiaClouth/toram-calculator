import type {
  MainWeaType,
  Skill,
  SkillCost,
  SkillEffect,
  SkillYield,
  BaseAbi,
  SubWeaType,
  BodyArmorType,
  Character,
  SpecialAbi,
  EquipmentList,
  Fashion,
  Cuisine,
  Consumable,
  SkillList,
  Combo,
  Pet,
  ModifiersList,
  MainWeapon,
  SubWeapon,
  BodyArmor,
  AdditionalEquipment,
  SpecialEquipment,
} from "@prisma/client";

export type abiType =
  | "str"
  | "int"
  | "vit"
  | "agi"
  | "dex"
  | "luc"
  | "tec"
  | "men"
  | "cri";

export interface _SkillEffect extends SkillEffect {
  cost: SkillCost[];
  yield: SkillYield[];
}

export interface _Skill extends Skill {
  skillEffect: _SkillEffect[];
}

interface _EquipmentList extends EquipmentList {
  mainWeapon: MainWeapon;
  subWeapon: SubWeapon;
  bodyArmor: BodyArmor;
  addEquipment: AdditionalEquipment;
  spcialEquipment: SpecialEquipment;
}

export interface _Character extends Character {
  baseAbi: BaseAbi;
  specialAbi: SpecialAbi;
  equipmentList: _EquipmentList;
  fashion: Fashion;
  cuisine: Cuisine;
  consumableList: Consumable[];
  skill: SkillList;
  combos: Combo[];
  pet: Pet;
  modifiersList: ModifiersList;
}

type modifiers = {
  baseValue: number;
  modifiers: {
    valueType: "percentage" | "fixed";
    value: number;
    origin: string;
  }[];
};

export interface CharacterState {
  systemAttributes: {
    // 系统数值：由系统决定基础值，玩家决定加成项的
    pPie: modifiers;
    mPie: modifiers;
    nDis: modifiers;
    fDis: modifiers;
    crT: modifiers;
    cdT: modifiers;
    stro: modifiers;
    total: modifiers;
    final: modifiers;
    am: modifiers;
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
        stability: number;
      };
    };
  };
  derivedAttributes: {
    // 衍生属性：基础值自由数值决定，玩家只能定义加成项的
    maxHP: modifiers;
    maxMP: modifiers;
    mainWeaAtk: modifiers;
    subWeaAtk: modifiers;
    totalWeaAtk: modifiers;
    pStab: modifiers;
    mStab: modifiers;
    pCr: modifiers;
    pCd: modifiers;
    pAtk: modifiers;
    mAtk: modifiers;
    aspd: modifiers;
    cspd: modifiers;
  };
}

export interface MonsterState {
  hp: number;
  pDef: number;
  pRes: number;
  mDef: number;
  mRes: number;
}

export interface FrameData {
  frame: number;
  characterState: CharacterState;
}
