import { create } from "zustand";
import { produce } from "immer";

import type { Analyzer, Monster, SkillCost, SkillYield } from "@prisma/client";
import { SkillEffect, type Skill } from "~/server/api/routers/skill";

// if you need middleware
// import { devtools, persist } from 'zustand/middleware'

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
  viewCount: 0,
  usageCount: 0,
  createdByUserId: null,
  createdAt: new Date(),
  updatedByUserId: null,
  updatedAt: new Date(),
  usageTimestamps: [],
  viewTimestamps: [],
};

// 技能表单的默认值
export const defaultSkillEffectCost: SkillCost = {
  id: "",
  costType: "MAINWEAPON_TYPE",
  costFormula: "",
  skillEffectId: null
}

export const defaultSkillEffectYield: SkillYield = {
  id: "",
  triggerTiming: "ON_USE",
  delay: 0,
  durationType: "FRAME",
  durationValue: 0,
  yieldType: "MAINWEAPON_TYPE",
  yieldFormula: "",
  skillEffectId: null
}

export const defaultSkillEffect: SkillEffect = {
  id: "",
  condition: "",
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
  createdByUserId: null,
  updatedByUserId: null,
  viewCount: 0,
  usageCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  usageTimestamps: [],
  viewTimestamps: [],
  level: 0,
  skillTreeName: "SWORLD",
  skillType: "ACTIVE_SKILL",
  weaponElementDependencyType: "TRUE",
  element: "NO_ELEMENT",
  skillEffect: [defaultSkillEffect]
};

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
