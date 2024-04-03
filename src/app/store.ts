import { create } from "zustand";
import { produce } from "immer";

import type { Monster } from "@prisma/client";

// if you need middleware
// import { devtools, persist } from 'zustand/middleware'

// 怪物表单的默认值
export const defaultMonster: Monster = {
  id: "",
  updatedAt: new Date(),
  updatedByUserId: "",
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
  difficultyOfTank: 0,
  difficultyOfMelee: 0,
  difficultyOfRanged: 0,
  possibilityOfRunningAround: 0,
  specialBehavior: "",
  viewCount: 0,
  usageCount: 0,
  createdByUserId: "",
  createdAt: new Date(),
  usageTimestamps: [],
  viewTimestamps: [],
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
    monsterFormState: "CREATE" | "UPDATE";
    setMonsterFormState: (newState: "CREATE" | "UPDATE") => void;
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
      monsterFormState: "CREATE",
      setMonsterFormState: (newState: "CREATE" | "UPDATE") =>
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
