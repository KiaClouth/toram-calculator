import { create } from "zustand";
import { produce } from "immer";

import type { Analyzer } from "@prisma/client";
import { type SkillEffect, type Skill, type SkillCost, type SkillYield } from "~/server/api/routers/skill";
import type { Monster } from "~/server/api/routers/monster";
import type { Character, Cuisine, Fashion } from "~/server/api/routers/character";
import { type SubWeapon, type AdditionalEquipment, type BodyArmor, type MainWeapon, type SpecialEquipment } from "~/server/api/routers/equipment";
import type { Crystal, ModifiersList,Modifier } from "~/server/api/routers/crystal";
import type { Consumable } from "~/server/api/routers/consumable";
import type { Pet } from "~/server/api/routers/pet";

// if you need middleware
// import { devtools, persist } from 'zustand/middleware'

const defaultStatistics = {
  createdByUserId: null,
  updatedByUserId: null,
  viewCount: 0,
  usageCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  usageTimestamps: [],
  viewTimestamps: []
}

// 怪物表单的默认值
export const defaultMonster: Monster = {
  id: "",
  state: "PUBLIC",
  name: "",
  monsterType: "COMMON_BOSS",
  baseLv: 0,
  experience: 0,
  address: "",
  element: "NO_ELEMENT",
  radius: 1,
  maxhp: 0,
  physicalDefense: 0,
  physicalResistance: 0,
  magicalDefense: 0,
  magicalResistance: 0,
  criticalResistance: 0,
  avoidance: 0,
  dodge: 0,
  block: 0,
  normalAttackResistanceModifier: 0,
  physicalAttackResistanceModifier: 0,
  magicalAttackResistanceModifier: 0,
  difficultyOfTank: 5,
  difficultyOfMelee: 5,
  difficultyOfRanged: 5,
  possibilityOfRunningAround: 0,
  specialBehavior: "",
  raters: [],
  dataSources: "",
  ...defaultStatistics,
};

// 技能表单的默认值
export const defaultSkillEffectCost: SkillCost = {
  id: "",
  costFormula: "",
  skillEffectId: null
}

export const defaultSkillEffectYield: SkillYield = {
  id: "",
  triggerTimingType: "ON_USE",
  delay: 0,
  durationType: "FRAME",
  durationValue: 0,
  yieldFormula: "",
  skillEffectId: null
}

export const defaultSkillEffect: SkillEffect = {
  id: "",
  condition: "",
  description: "",
  actionBaseDuration: 24,
  actionModifiableDuration: 98,
  belongToskillId: "",
  castingDurationFormula: "0",
  skillCost: [defaultSkillEffectCost],
  skillYield: [defaultSkillEffectYield],
}

export const defaultSkill: Skill = {
  id: "",
  state: "PUBLIC",
  name: "",
  level: 0,
  skillDescription: "",
  skillTreeName: "SWORLD",
  skillType: "ACTIVE_SKILL",
  weaponElementDependencyType: "TRUE",
  element: "NO_ELEMENT",
  skillEffect: [defaultSkillEffect],
  ...defaultStatistics,
};

export const defauleModifier: Modifier = {
  id: "",
  modifiersValueType: "FLAT_BONUS",
  value: 0,
  modifiersName: "STR"
}

export const defaultModifiersList: ModifiersList = {
  id: "",
  modifiers: [defauleModifier],
}

export const defaultCrystal: Crystal = {
  id: "",
  state: "PRIVATE",
  name: "",
  type: "GENERAL",
  front: 0,
  modifiersListId: defaultModifiersList.id,
  raters: [],
  ...defaultStatistics,
}

export const defaultMainWeapon: MainWeapon = {
  id: "",
  state: "PRIVATE",
  name: "",
  mainWeaType: "MAGIC_DEVICE",
  baseAtk: 0,
  refinement: 0,
  stability: 0,
  element: "NO_ELEMENT",
  crystal: [defaultCrystal],
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
}

export const defaultSubWeapon: SubWeapon = {
  id: "",
  state: "PRIVATE",
  name: "",
  subWeaType: "NO_WEAPOEN",
  baseAtk: 0,
  refinement: 0,
  stability: 0,
  element: "NO_ELEMENT",
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
}

export const defaultBodyArmor: BodyArmor = {
  id: "",
  state: "PRIVATE",
  name: "",
  bodyArmorType: "NORMAL",
  refinement: 0,
  baseDef: 0,
  crystal: [defaultCrystal],
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
}

export const defaultAdditionalEquipment: AdditionalEquipment = {
  id: "",
  state: "PRIVATE",
  name: "",
  refinement: 0,
  crystal: [defaultCrystal],
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
}

export const defaultSpecialEquipment: SpecialEquipment = {
  id: "",
  state: "PRIVATE",
  name: "",
  crystal: [defaultCrystal],
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
}

export const defaultFasion: Fashion = {
  modifiersListId: "",
  updatedAt: new Date(),
  characterId: ""
}

export const defaultCuisine: Cuisine = {
  modifiersListId: "",
  updatedAt: new Date(),
  characterId: ""
}

export const defaultconsumable: Consumable = {
  id: "",
  state: "PUBLIC",
  name: "",
  raters: [],
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
}

export const defaultPet: Pet = {
  id: "",
  state: "PRIVATE",
  name: null,
  raters: [],
  ...defaultStatistics,
}

export const defaultCharacter: Character = {
  id: "",
  state: "PUBLIC",
  name: "",
  lv: 0,
  baseAbi: {
    baseStr: 0,
    baseInt: 0,
    baseVit: 0,
    baseAgi: 0,
    baseDex: 0,
    characterId: ""
  },
  specialAbi: {
    specialAbiType: "NULL",
    value: 0,
    characterId: ""
  },
  equipmentList: {
    mainWeapon: defaultMainWeapon,
    mainWeaponId: "",
    subWeapon: defaultSubWeapon,
    subWeaponId: "",
    bodyArmor: defaultBodyArmor,
    bodyArmorId: "",
    additionalEquipment: defaultAdditionalEquipment,
    additionalEquipmentId: "",
    specialEquipment: defaultSpecialEquipment,
    specialEquipmentId: "",
    characterId: ""
  },
  fashion: defaultFasion,
  cuisine: defaultCuisine,
  consumableList: {
    updatedAt: new Date(),
    characterId: "",
    consumables: [defaultconsumable]
  },
  skillList: {
    updatedAt: new Date(),
    characterId: "",
    skills: [defaultSkill]
  },
  combos: [],
  pet: defaultPet,
  petId: defaultPet.id,
  modifiersList: defaultModifiersList,
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
}


export const defaultAnalyzer: Analyzer = {
  id: "",
  name: "",
  state: "PRIVATE",
  createdAt: new Date(),
  createdByUserId: null,
  monsterId: null,
  characterId: null
}

// 应用客户端状态数据类型定义
interface AppState {
  bears: number;
  increase: (by: number) => void;
  monsterPage: {
    monsterList: Monster[];
    setMonsterList: (newMonsterList: Monster[]) => void;
    monster: Monster;
    setMonster: (newMonster: Monster) => void;
    monsterDialogState: boolean;
    setMonsterDialogState: (newState: boolean) => void;
    monsterFormState: "CREATE" | "UPDATE" | "DISPLAY";
    setMonsterFormState: (newState: "CREATE" | "UPDATE" | "DISPLAY") => void;
    filterState: boolean;
    setFilterState: (newState: boolean) => void;
  };
  skillPage: {
    skillList: Skill[];
    setSkillList: (newSkillList: Skill[]) => void;
    skill: Skill;
    setSkill: (newSkill: Skill) => void;
    skillDialogState: boolean;
    setSkillDialogState: (newState: boolean) => void;
    skillFormState: "CREATE" | "UPDATE" | "DISPLAY";
    setSkillFormState: (newState: "CREATE" | "UPDATE" | "DISPLAY") => void;
    filterState: boolean;
    setFilterState: (newState: boolean) => void;
  };
  analyzePage: {
    analyzeList: Analyzer[];
    setAnalyzeList: (newAnalyzeList: Analyzer[]) => void;
    analyze: Analyzer;
    setAnalyze: (newAnalyze: Analyzer) => void;
    analyzeDialogState: boolean;
    setAnalyzeDialogState: (newState: boolean) => void;
    analyzeFormState: "CREATE" | "UPDATE" | "DISPLAY";
    setAnalyzeFormState: (newState: "CREATE" | "UPDATE" | "DISPLAY") => void;
    filterState: boolean;
    setFilterState: (newState: boolean) => void;
  }
}

export const useBearStore = create<AppState>()(
  (set) => ({
    bears: 0,
    increase: (by) => set((state) => ({ bears: state.bears + by })),
    monsterPage: {
      monsterList: [],
      setMonsterList: (newMonsterList: Monster[]) =>
        set(
          produce((state: AppState) => {
            state.monsterPage.monsterList = newMonsterList;
          }),
        ),
      monster: defaultMonster,
      setMonster: (newMonster: Monster) =>
        set(
          // (state) => ({ // 笨比写法
          //   monsterPage: {
          //     ...state.monsterPage,
          //     monster: newMonster,
          //   }
          // })
          produce((state: AppState) => {
            state.monsterPage.monster = newMonster;
          }),
        ),
      monsterDialogState: false,
      setMonsterDialogState: (newState: boolean) =>
        set(
          produce((state: AppState) => {
            state.monsterPage.monsterDialogState = newState;
          }),
        ),
      monsterFormState: "DISPLAY",
      setMonsterFormState: (newState: "CREATE" | "UPDATE" | "DISPLAY") =>
        set(
          produce((state: AppState) => {
            state.monsterPage.monsterFormState = newState;
          }),
        ),
      filterState: false,
      setFilterState: (newState: boolean) =>
        set(
          produce((state: AppState) => {
            state.monsterPage.filterState = newState;
          }),
        ),
    },
    skillPage: {
      skillList: [],
      setSkillList: (newSkillList: Skill[]) =>
        set(
          produce((state: AppState) => {
            state.skillPage.skillList = newSkillList;
          }),
        ),
      skill: defaultSkill,
      setSkill: (newSkill: Skill) =>
        set(
          produce((state: AppState) => {
            state.skillPage.skill = newSkill;
          }),
        ),
      skillDialogState: false,
      setSkillDialogState: (newState: boolean) =>
        set(
          produce((state: AppState) => {
            state.skillPage.skillDialogState = newState;
          }),
        ),
      skillFormState: "CREATE",
      setSkillFormState: (newState: "CREATE" | "UPDATE" | "DISPLAY") =>
        set(
          produce((state: AppState) => {
            state.skillPage.skillFormState = newState;
          }),
        ),
      filterState: false,
      setFilterState: (newState: boolean) =>
        set(
          produce((state: AppState) => {
            state.skillPage.filterState = newState;
          }),
        ),
    },
    analyzePage: {
      analyzeList: [],
      setAnalyzeList: (newAnalyzeList: Analyzer[]) => set(
        produce((state: AppState) => {
          state.analyzePage.analyzeList = newAnalyzeList;
        })
      ),
      analyze: defaultAnalyzer,
      setAnalyze: (newAnalyze: Analyzer) => set(
        produce((state: AppState) => {
          state.analyzePage.analyze = newAnalyze;
        })),
      analyzeDialogState: false,
      setAnalyzeDialogState: (newState: boolean) => set(
        produce((state: AppState) => {
          state.analyzePage.analyzeDialogState = newState;
        })
      ),
      analyzeFormState: "DISPLAY",
      setAnalyzeFormState: (newState: "CREATE" | "UPDATE" | "DISPLAY") => set(
        produce((state: AppState) => {
          state.analyzePage.analyzeFormState = newState;
        })
      ),
      filterState: false,
      setFilterState: (newState: boolean) => set(
        produce((state: AppState) => {
          state.analyzePage.filterState = newState;
        })
      )
    }
  }),

  // if you need middleware
  // devtools(
  //   persist(
  //     (set) => ({
  //       bears: 0,
  //       increase: (by) => set((state) => ({ bears: state.bears + by })),
  //     }),
  //     {
  //       name: 'bear-storage',
  //     }
  //   )
  // )
);
