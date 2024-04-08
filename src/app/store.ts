import { create } from "zustand";
import { produce } from "immer";

import type { Monster, Skill } from "@prisma/client";

// if you need middleware
// import { devtools, persist } from 'zustand/middleware'

// 怪物表单的默认值
export const defaultMonster: Monster = {
  id: "",
  state: "PRIVATE",
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
  accuracy: null
};

// 技能表单的默认值
export const defaultSkill: Skill = {
  id: "",
  state: "PRIVATE",
  name: null,
  type: "BUFF",
  mpCost: 0,
  mpGain: 0,
  hpCost: 0,
  hpGain: 0,
  createdByUserId: null,
  updatedByUserId: null,
  viewCount: 0,
  usageCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  usageTimestamps: [],
  viewTimestamps: [],
  level: 0,
  treeName: "SWORLD",
  accuracy: null
};

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
    skillFormState: "CREATE" | "UPDATE";
    setSkillFormState: (newState: "CREATE" | "UPDATE") => void;
    filterState: boolean;
    setFilterState: (newState: boolean) => void;
  };
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
      setSkillFormState: (newState: "CREATE" | "UPDATE") =>
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
