import { create } from "zustand";
import { produce } from "immer";

import type { Analyzer, Combo } from "@prisma/client";
import { type SkillEffect, type Skill, type SkillCost, type SkillYield } from "~/server/api/routers/skill";
import type { Monster } from "~/server/api/routers/monster";
import type { Character } from "~/server/api/routers/character";
import {
  type SubWeapon,
  type AdditionalEquipment,
  type BodyArmor,
  type MainWeapon,
  type SpecialEquipment,
} from "~/server/api/routers/equipment";
import type { Crystal, ModifiersList, Modifier } from "~/server/api/routers/crystal";
import type { Consumable } from "~/server/api/routers/consumable";
import type { Pet } from "~/server/api/routers/pet";
import { type skillSequenceList } from "./[lang]/analyze/client";

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
  viewTimestamps: [],
};

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
  rates: [],
  dataSources: "",
  ...defaultStatistics,
};

// 技能表单的默认值
export const defaultSkillEffectCost: SkillCost = {
  id: "",
  name: "MP Cost",
  costFormula: "",
  skillEffectId: null,
};

export const defaultSkillEffectYield: SkillYield = {
  id: "",
  name: "",
  yieldType: "ImmediateEffect",
  mutationTimingFormula: "",
  yieldFormula: "",
  skillEffectId: null,
};

export const defaultSkillEffect: SkillEffect = {
  id: "",
  condition: "",
  description: "",
  actionBaseDurationFormula: "13",
  actionModifiableDurationFormula: "48",
  skillExtraActionType: "None",
  chargingBaseDurationFormula: "0",
  chargingModifiableDurationFormula: "0",
  chantingBaseDurationFormula: "0",
  chantingModifiableDurationFormula: "0",
  skillStartupFramesFormula: "0",
  skillCost: [defaultSkillEffectCost],
  skillYield: [defaultSkillEffectYield],
  belongToskillId: "",
};

export const defaultSkill: Skill = {
  id: "",
  state: "PUBLIC",
  name: "",
  level: 0,
  skillDescription: "",
  skillTreeName: "BLADE",
  skillType: "ACTIVE_SKILL",
  weaponElementDependencyType: "TRUE",
  element: "NO_ELEMENT",
  skillEffect: [defaultSkillEffect],
  ...defaultStatistics,
};

export const defauleModifier: Modifier = {
  id: "",
  formula: "",
};

export const defaultModifiersList: ModifiersList = {
  id: "",
  name: "SYSTEM",
  modifiers: [defauleModifier],
};

export const defaultCrystal: Crystal = {
  id: "",
  state: "PRIVATE",
  name: "",
  crystalType: "GENERAL",
  front: 0,
  modifiersList: defaultModifiersList,
  modifiersListId: defaultModifiersList.id,
  rates: [],
  ...defaultStatistics,
};

export const defaultMainWeapon: MainWeapon = {
  id: "",
  state: "PRIVATE",
  name: "",
  mainWeaponType: "MAGIC_DEVICE",
  baseAtk: 0,
  refinement: 0,
  stability: 0,
  element: "NO_ELEMENT",
  crystal: [defaultCrystal],
  modifiersList: defaultModifiersList,
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
};

export const defaultSubWeapon: SubWeapon = {
  id: "",
  state: "PRIVATE",
  name: "",
  subWeaponType: "NO_WEAPON",
  baseAtk: 0,
  refinement: 0,
  stability: 0,
  element: "NO_ELEMENT",
  modifiersList: defaultModifiersList,
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
};

export const defaultBodyArmor: BodyArmor = {
  id: "",
  state: "PRIVATE",
  name: "",
  bodyArmorType: "NORMAL",
  refinement: 0,
  baseDef: 0,
  crystal: [defaultCrystal],
  modifiersList: defaultModifiersList,
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
};

export const defaultAdditionalEquipment: AdditionalEquipment = {
  id: "",
  state: "PRIVATE",
  name: "",
  refinement: 0,
  crystal: [defaultCrystal],
  modifiersList: defaultModifiersList,
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
};

export const defaultSpecialEquipment: SpecialEquipment = {
  id: "",
  state: "PRIVATE",
  name: "",
  crystal: [defaultCrystal],
  modifiersList: defaultModifiersList,
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
};

export const defaultConsumable: Consumable = {
  id: "",
  state: "PUBLIC",
  name: "",
  rates: [],
  modifiersList: defaultModifiersList,
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
};

export const defaultPet: Pet = {
  id: "",
  state: "PRIVATE",
  name: null,
  rates: [],
  ...defaultStatistics,
};

export const defaultCombos: Combo = {
  id: "",
  state: "PRIVATE",
  name: null,
  createdAt: new Date(),
  createdByUserId: null,
};

export const defaultCharacter: Character = {
  id: "",
  state: "PUBLIC",
  characterType: "Tank",
  name: "",
  lv: 0,
  baseStr: 0,
  baseInt: 0,
  baseVit: 0,
  baseAgi: 0,
  baseDex: 0,
  specialAbiType: "NULL",
  specialAbiValue: 0,
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
  fashion: defaultModifiersList,
  fashionModifiersListId: "", 
  cuisine: defaultModifiersList,
  CuisineModifiersListId: "",
  consumableList: [defaultConsumable],
  skillList: [defaultSkill],
  combos: [],
  pet: defaultPet,
  petId: defaultPet.id,
  modifiersList: defaultModifiersList,
  modifiersListId: defaultModifiersList.id,
  ...defaultStatistics,
};

export const defaultAnalyzer: Analyzer = {
  id: "",
  name: "",
  state: "PRIVATE",
  createdAt: new Date(),
  createdByUserId: null,
  monsterId: null,
  characterId: null,
};

// 应用客户端状态数据类型定义
interface AppState {
  monster: Monster;
  setMonster: (newMonster: Monster) => void;
  monsterPage: {
    augmented: boolean;
    setAugmented: (newState: boolean) => void;
    monsterList: Monster[];
    setMonsterList: (newMonsterList: Monster[]) => void;
    monsterDialogState: boolean;
    setMonsterDialogState: (newState: boolean) => void;
    monsterFormState: "CREATE" | "UPDATE" | "DISPLAY";
    setMonsterFormState: (newState: "CREATE" | "UPDATE" | "DISPLAY") => void;
    filterState: boolean;
    setFilterState: (newState: boolean) => void;
  };
  crystal: Crystal;
  setCrystal: (newCrystal: Crystal) => void;
  crystalPage: {
    augmented: boolean;
    setAugmented: (newState: boolean) => void;
    crystalList: Crystal[];
    setCrystalList: (newCrystalList: Crystal[]) => void;
    crystalDialogState: boolean;
    setCrystalDialogState: (newState: boolean) => void;
    crystalFormState: "CREATE" | "UPDATE" | "DISPLAY";
    setCrystalFormState: (newState: "CREATE" | "UPDATE" | "DISPLAY") => void;
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
  character: Character;
  setCharacter: (newCharacter: Character) => void;
  characterPage: {
    augmented: boolean;
    setAugmented: (newState: boolean) => void;
    characterList: Character[];
    setCharacterList: (newCharacterList: Character[]) => void;
    characterDialogState: boolean;
    setCharacterDialogState: (newState: boolean) => void;
    characterFormState: "CREATE" | "UPDATE" | "DISPLAY";
    setCharacterFormState: (newState: "CREATE" | "UPDATE" | "DISPLAY") => void;
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
  };
}

export const useStore = create<AppState>()(
  (set) => ({
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
          state.monster = newMonster;
        }),
      ),
    monsterPage: {
      augmented: true,
      setAugmented: (newState: boolean) =>
        set(
          produce((state: AppState) => {
            state.monsterPage.augmented = newState;
          }),
        ),
      monsterList: [],
      setMonsterList: (newMonsterList: Monster[]) =>
        set(
          produce((state: AppState) => {
            state.monsterPage.monsterList = newMonsterList;
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
    crystal: defaultCrystal,
    setCrystal: (newCrystal: Crystal) =>
      set(
        produce((state: AppState) => {
          state.crystal = newCrystal;
        }),
      ),
    crystalPage: {
      augmented: true,
      setAugmented: (newState: boolean) =>
        set(
          produce((state: AppState) => {
            state.crystalPage.augmented = newState;
          }),
        ),
      crystalList: [],
      setCrystalList: (newCrystalList: Crystal[]) =>
        set(
          produce((state: AppState) => {
            state.crystalPage.crystalList = newCrystalList;
          }),
        ),
      crystalDialogState: false,
      setCrystalDialogState: (newState: boolean) =>
        set(
          produce((state: AppState) => {
            state.crystalPage.crystalDialogState = newState;
          }),
        ),
      crystalFormState: "DISPLAY",
      setCrystalFormState: (newState: "CREATE" | "UPDATE" | "DISPLAY") =>
        set(
          produce((state: AppState) => {
            state.crystalPage.crystalFormState = newState;
          }),
        ),
      filterState: false,
      setFilterState: (newState: boolean) =>
        set(
          produce((state: AppState) => {
            state.crystalPage.filterState = newState;
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
    character: defaultCharacter,
    setCharacter: (newCharacter: Character) =>
      set(
        produce((state: AppState) => {
          state.character = newCharacter;
        }),
      ),
    characterPage: {
      augmented: true,
      setAugmented: (newState: boolean) =>
        set(
          produce((state: AppState) => {
            state.characterPage.augmented = newState;
          }),
        ),
      characterList: [],
      setCharacterList: (newCharacterList: Character[]) =>
        set(
          produce((state: AppState) => {
            state.characterPage.characterList = newCharacterList;
          }),
        ),
      characterDialogState: false,
      setCharacterDialogState: (newState: boolean) =>
        set(
          produce((state: AppState) => {
            state.characterPage.characterDialogState = newState;
          }),
        ),
      characterFormState: "DISPLAY",
      setCharacterFormState: (newState: "CREATE" | "UPDATE" | "DISPLAY") =>
        set(
          produce((state: AppState) => {
            state.characterPage.characterFormState = newState;
          }),
        ),
      filterState: false,
      setFilterState: (newState: boolean) =>
        set(
          produce((state: AppState) => {
            state.characterPage.filterState = newState;
          }),
        ),
    },
    analyzePage: {
      analyzeList: [],
      setAnalyzeList: (newAnalyzeList: Analyzer[]) =>
        set(
          produce((state: AppState) => {
            state.analyzePage.analyzeList = newAnalyzeList;
          }),
        ),
      analyze: defaultAnalyzer,
      setAnalyze: (newAnalyze: Analyzer) =>
        set(
          produce((state: AppState) => {
            state.analyzePage.analyze = newAnalyze;
          }),
        ),
      analyzeDialogState: false,
      setAnalyzeDialogState: (newState: boolean) =>
        set(
          produce((state: AppState) => {
            state.analyzePage.analyzeDialogState = newState;
          }),
        ),
      analyzeFormState: "DISPLAY",
      setAnalyzeFormState: (newState: "CREATE" | "UPDATE" | "DISPLAY") =>
        set(
          produce((state: AppState) => {
            state.analyzePage.analyzeFormState = newState;
          }),
        ),
      filterState: false,
      setFilterState: (newState: boolean) =>
        set(
          produce((state: AppState) => {
            state.analyzePage.filterState = newState;
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

export const test = {
  character: {
    id: "",
    state: "PUBLIC",
    characterType: "Tank",
    name: "测试机体",
    lv: 265,
    baseStr: 0,
    baseInt: 440,
    baseVit: 0,
    baseAgi: 0,
    baseDex: 247,
    specialAbiType: "NULL",
    specialAbiValue: 0,
    mainWeapon: {
      id: "",
      state: "PRIVATE",
      name: "暴击残酷之翼",
      mainWeaponType: "MAGIC_DEVICE",
      baseAtk: 194,
      refinement: 15,
      stability: 70,
      element: "LIGHT",
      crystal: [
        {
          id: "",
          state: "PRIVATE",
          name: "寄生甲兽",
          crystalType: "WEAPONCRYSTAL",
          front: 0,
          modifiersList: {
            id: "",
            name: "寄生甲兽",
            modifiers: [
              {
                id: "",
                formula: "mAtk + 5%",
              },
              {
                id: "",
                formula: "mPie + 20",
              },
              {
                id: "",
                formula: "cspd - 15%",
              },
            ],
          },
          modifiersListId: "",
          rates: [],
          ...defaultStatistics,
        },
        {
          id: "",
          state: "PRIVATE",
          name: "死灵妖兔II",
          crystalType: "WEAPONCRYSTAL",
          front: 1,
          modifiersList: {
            id: "",
            name: "死灵妖兔II",
            modifiers: [
              {
                id: "",
                formula: "mAtk + isMAGIC_DEVICE(mainWeapon) ?  7 : 0 %",
              },
              {
                id: "",
                formula: "cspd + 14%",
              },
              {
                id: "",
                formula: "maxHp - 15%",
              },
              {
                id: "",
                formula: "am + 3",
              },
            ],
          },
          modifiersListId: "",
          rates: [],
          ...defaultStatistics,
        },
      ],
      modifiersList: {
        id: "",
        name: "暴击残酷之翼属性",
        modifiers: [
          {
            id: "",
            formula: "",
          },
        ],
      },
      modifiersListId: "",
      ...defaultStatistics,
    },
    mainWeaponId: "",
    subWeapon: {
      id: "",
      state: "PRIVATE",
      name: "忍术卷轴·风遁术",
      subWeaponType: "NO_WEAPON",
      baseAtk: 0,
      refinement: 0,
      stability: 0,
      element: "NO_ELEMENT",
      modifiersList: {
        id: "",
        name: "忍术卷轴·风遁术属性",
        modifiers: [
          {
            id: "",
            formula: "",
          },
        ],
      },
      modifiersListId: "",
      ...defaultStatistics,
    },
    subWeaponId: "",
    bodyArmor: {
      id: "",
      state: "PRIVATE",
      name: "冒险者服装",
      bodyArmorType: "NORMAL",
      refinement: 0,
      baseDef: 0,
      crystal: [
        {
          id: "",
          state: "PRIVATE",
          name: "铁之女帝",
          crystalType: "GENERAL",
          front: 0,
          modifiersList: {
            id: "",
            name: "铁之女帝属性",
            modifiers: [
              {
                id: "",
                formula: "",
              },
            ],
          },
          modifiersListId: "",
          rates: [],
          ...defaultStatistics,
        },
        {
          id: "",
          state: "PRIVATE",
          name: "约尔拉兹",
          crystalType: "GENERAL",
          front: 0,
          modifiersList: {
            id: "",
            name: "约尔拉兹属性",
            modifiers: [
              {
                id: "",
                formula: "",
              },
            ],
          },
          modifiersListId: "",
          rates: [],
          ...defaultStatistics,
        },
      ],
      modifiersList: {
        id: "",
        name: "冒险者服装属性",
        modifiers: [
          {
            id: "",
            formula: "",
          },
        ],
      },
      modifiersListId: "",
      ...defaultStatistics,
    },
    bodyArmorId: "",
    additionalEquipment: {
      id: "",
      state: "PRIVATE",
      name: "饼干腰翼",
      refinement: 0,
      crystal: [
        {
          id: "",
          state: "PRIVATE",
          name: "深谋的青影",
          crystalType: "GENERAL",
          front: 0,
          modifiersList: {
            id: "",
            name: "深谋的青影属性",
            modifiers: [
              {
                id: "",
                formula: "",
              },
            ],
          },
          modifiersListId: "",
          rates: [],
          ...defaultStatistics,
        },
        {
          id: "",
          state: "PRIVATE",
          name: "蜜爱丽",
          crystalType: "GENERAL",
          front: 0,
          modifiersList: {
            id: "",
            name: "蜜爱丽属性",
            modifiers: [
              {
                id: "",
                formula: "",
              },
            ],
          },
          modifiersListId: "",
          rates: [],
          ...defaultStatistics,
        },
      ],
      modifiersList: {
        id: "",
        name: "饼干腰翼属性",
        modifiers: [
          {
            id: "",
            formula: "",
          },
        ],
      },
      modifiersListId: "",
      ...defaultStatistics,
    },
    additionalEquipmentId: "",
    specialEquipment: {
      id: "",
      state: "PRIVATE",
      name: "读星提灯",
      crystal: [
        {
          id: "",
          state: "PRIVATE",
          name: "星之魔导士",
          crystalType: "GENERAL",
          front: 0,
          modifiersList: {
            id: "",
            name: "星之魔导士属性",
            modifiers: [
              {
                id: "",
                formula: "",
              },
            ],
          },
          modifiersListId: "",
          rates: [],
          ...defaultStatistics,
        },
        {
          id: "",
          state: "PRIVATE",
          name: "塔图罗基特",
          crystalType: "GENERAL",
          front: 0,
          modifiersList: {
            id: "",
            name: "塔图罗基特属性",
            modifiers: [
              {
                id: "",
                formula: "",
              },
            ],
          },
          modifiersListId: "",
          rates: [],
          ...defaultStatistics,
        },
      ],
      modifiersList: {
        id: "",
        name: "读星提灯属性",
        modifiers: [
          {
            id: "",
            formula: "",
          },
        ],
      },
      modifiersListId: "",
      ...defaultStatistics,
    },
    specialEquipmentId: "",
    fashion: defaultModifiersList,
    fashionModifiersListId: "",
    cuisine: defaultModifiersList,
    CuisineModifiersListId: "",
    consumableList: [defaultConsumable],
    skillList: [defaultSkill],
    combos: [],
    pet: defaultPet,
    petId: defaultPet.id,
    modifiersList: defaultModifiersList,
    modifiersListId: defaultModifiersList.id,
    ...defaultStatistics,
  } satisfies Character,
  monster: {
    id: "",
    state: "PUBLIC",
    name: "岩龙菲尔岑 四星",
    monsterType: "COMMON_BOSS",
    baseLv: 251,
    experience: 0,
    address: "",
    element: "EARTH",
    radius: 2,
    maxhp: 31710000,
    physicalDefense: 6330,
    physicalResistance: 8,
    magicalDefense: 4434,
    magicalResistance: 8,
    criticalResistance: 20,
    avoidance: 1896,
    dodge: 2,
    block: 8,
    normalAttackResistanceModifier: 0,
    physicalAttackResistanceModifier: 0,
    magicalAttackResistanceModifier: 0,
    difficultyOfTank: 5,
    difficultyOfMelee: 5,
    difficultyOfRanged: 5,
    possibilityOfRunningAround: 0,
    specialBehavior: "",
    rates: [],
    dataSources: "",
    ...defaultStatistics,
  } satisfies Monster,
  skillSequence1: {
    name: "skillSequence1",
    data: [
      {
        id: "",
        state: "PUBLIC",
        skillTreeName: "MAGIC",
        name: "神速掌握",
        skillDescription: "",
        level: 10,
        weaponElementDependencyType: "TRUE",
        element: "NO_ELEMENT",
        skillType: "ACTIVE_SKILL",
        skillEffect: {
          id: "",
          description: null,
          actionBaseDurationFormula: "13",
          actionModifiableDurationFormula: "48",
          skillExtraActionType: "None",
          chargingBaseDurationFormula: "0",
          chargingModifiableDurationFormula: "0",
          chantingBaseDurationFormula: "0",
          chantingModifiableDurationFormula: "0",
          skillStartupFramesFormula: "13",
          belongToskillId: "",
          skillCost: [
            {
              id: "",
              name: "MP Cost",
              costFormula: "100",
              skillEffectId: null,
            },
          ],
          skillYield: [
            {
              id: "",
              name: "角色行动速度+10%",
              yieldType: "ImmediateEffect",
              yieldFormula: "p.am + 10",
              mutationTimingFormula: null,
              skillEffectId: null,
            },
            {
              id: "",
              name: "角色攻速+300",
              yieldType: "ImmediateEffect",
              mutationTimingFormula: null,
              yieldFormula: "p.aspd + 300",
              skillEffectId: null,
            },
          ],
        },
      },
      {
        id: "",
        state: "PUBLIC",
        skillTreeName: "MAGIC",
        name: "神速掌握",
        skillDescription: "",
        level: 10,
        weaponElementDependencyType: "TRUE",
        element: "NO_ELEMENT",
        skillType: "ACTIVE_SKILL",
        skillEffect: {
          id: "",
          description: null,
          actionBaseDurationFormula: "13",
          actionModifiableDurationFormula: "48",
          skillExtraActionType: "None",
          chargingBaseDurationFormula: "0",
          chargingModifiableDurationFormula: "0",
          chantingBaseDurationFormula: "0",
          chantingModifiableDurationFormula: "0",
          skillStartupFramesFormula: "13",
          belongToskillId: "",
          skillCost: [
            {
              id: "",
              name: "MP Cost",
              costFormula: "100",
              skillEffectId: null,
            },
          ],
          skillYield: [
            {
              id: "",
              name: "角色行动速度+10%",
              yieldType: "ImmediateEffect",
              yieldFormula: "p.am + 10",
              mutationTimingFormula: null,
              skillEffectId: null,
            },
            {
              id: "",
              name: "角色攻速+300",
              yieldType: "ImmediateEffect",
              mutationTimingFormula: null,
              yieldFormula: "p.aspd + 300",
              skillEffectId: null,
            },
          ],
        },
      },
      {
        id: "",
        state: "PUBLIC",
        skillTreeName: "MAGIC",
        name: "神速掌握",
        skillDescription: "",
        level: 10,
        weaponElementDependencyType: "TRUE",
        element: "NO_ELEMENT",
        skillType: "ACTIVE_SKILL",
        skillEffect: {
          id: "",
          description: null,
          actionBaseDurationFormula: "13",
          actionModifiableDurationFormula: "48",
          skillExtraActionType: "None",
          chargingBaseDurationFormula: "0",
          chargingModifiableDurationFormula: "0",
          chantingBaseDurationFormula: "0",
          chantingModifiableDurationFormula: "0",
          skillStartupFramesFormula: "13",
          belongToskillId: "",
          skillCost: [
            {
              id: "",
              name: "MP Cost",
              costFormula: "100",
              skillEffectId: null,
            },
          ],
          skillYield: [
            {
              id: "",
              name: "角色行动速度+10%",
              yieldType: "ImmediateEffect",
              yieldFormula: "p.am + 10",
              mutationTimingFormula: null,
              skillEffectId: null,
            },
            {
              id: "",
              name: "角色攻速+300",
              yieldType: "ImmediateEffect",
              mutationTimingFormula: null,
              yieldFormula: "p.aspd + 300",
              skillEffectId: null,
            },
          ],
        },
      },
      {
        id: "",
        state: "PUBLIC",
        skillTreeName: "MAGIC",
        name: "魔法炮充填",
        skillDescription: "",
        level: 10,
        weaponElementDependencyType: "TRUE",
        element: "NO_ELEMENT",
        skillType: "ACTIVE_SKILL",
        skillEffect: {
          id: "",
          description: null,
          actionBaseDurationFormula: "13",
          actionModifiableDurationFormula: "48",
          skillExtraActionType: "Chanting",
          chargingBaseDurationFormula: "0",
          chargingModifiableDurationFormula: "0",
          chantingBaseDurationFormula: "0",
          chantingModifiableDurationFormula: "0",
          skillStartupFramesFormula: "0",
          belongToskillId: "",
          skillCost: [
            {
              id: "",
              name: "MP Cost",
              costFormula: "0",
              skillEffectId: null,
            },
          ],
          skillYield: [
            {
              id: "",
              name: "添加魔法炮层数计数器",
              yieldType: "ImmediateEffect",
              yieldFormula: "p.mfp = 0",
              mutationTimingFormula: null,
              skillEffectId: null,
            },
            {
              id: "",
              name: "魔法炮层数自动增长行为",
              yieldType: "PersistentEffect",
              mutationTimingFormula: "frame % 60 == 0 and frame > 0",
              yieldFormula: "p.mfp + ( p.mfp >= 100 ? 1/3 : 1 )",
              skillEffectId: null,
            },
          ],
        },
      },
      {
        id: "",
        state: "PUBLIC",
        skillTreeName: "MAGIC",
        name: "勇气源泉",
        skillDescription: "",
        level: 10,
        weaponElementDependencyType: "TRUE",
        element: "NO_ELEMENT",
        skillType: "ACTIVE_SKILL",
        skillEffect: {
          id: "",
          description: null,
          actionBaseDurationFormula: "23",
          actionModifiableDurationFormula: "148",
          skillExtraActionType: "Chanting",
          chargingBaseDurationFormula: "0",
          chargingModifiableDurationFormula: "0",
          chantingBaseDurationFormula: "0",
          chantingModifiableDurationFormula: "1",
          skillStartupFramesFormula: "",
          belongToskillId: "",
          skillCost: [
            {
              id: "",
              name: "MP Cost",
              costFormula: "400",
              skillEffectId: null,
            },
          ],
          skillYield: [
            {
              id: "",
              name: "角色最终伤害+20%",
              yieldType: "ImmediateEffect",
              yieldFormula: "p.final + 20",
              mutationTimingFormula: null,
              skillEffectId: null,
            },
            {
              id: "",
              name: "角色武器攻击+30%",
              yieldType: "ImmediateEffect",
              mutationTimingFormula: null,
              yieldFormula: "p.weaponAtk + 30%",
              skillEffectId: null,
            },
            {
              id: "",
              name: "角色命中-50%",
              yieldType: "ImmediateEffect",
              mutationTimingFormula: null,
              yieldFormula: "p.hit - 50%",
              skillEffectId: null,
            },
          ],
        },
      },
      {
        id: "",
        state: "PUBLIC",
        skillTreeName: "MAGIC",
        name: "冲击波",
        skillDescription: "",
        level: 7,
        weaponElementDependencyType: "TRUE",
        element: "NO_ELEMENT",
        skillType: "ACTIVE_SKILL",
        skillEffect: {
          id: "",
          description: null,
          actionBaseDurationFormula: "13",
          actionModifiableDurationFormula: "48",
          skillExtraActionType: "Chanting",
          chargingBaseDurationFormula: "0",
          chargingModifiableDurationFormula: "0",
          chantingBaseDurationFormula: "0",
          chantingModifiableDurationFormula: "max(0,min((2 - (p.lv - 1) * 0.25),(1 - (p.lv - 5) * 0.5)))",
          skillStartupFramesFormula: "0",
          belongToskillId: "",
          skillCost: [
            {
              id: "",
              name: "MP Cost",
              costFormula: "p.mp = p.mp - 200",
              skillEffectId: null,
            },
          ],
          skillYield: [
            {
              id: "",
              name: "Damage",
              yieldType: "ImmediateEffect",
              yieldFormula: "m.hp - (s.vMatk + 200) * 5",
              mutationTimingFormula: null,
              skillEffectId: null,
            },
            // {
            //   id: "",
            //   name: "MP Cost half",
            //   yieldType: "PersistentEffect",
            //   yieldFormula: "",
            //   skillEffectId: null,
            //   mutationTimingFormula: "false",
            // },
          ],
        },
      },
      {
        id: "",
        state: "PUBLIC",
        skillTreeName: "MAGIC",
        name: "爆能",
        level: 10,
        weaponElementDependencyType: "TRUE",
        element: "NO_ELEMENT",
        skillType: "ACTIVE_SKILL",
        skillDescription: "",
        skillEffect: {
          id: "",
          actionBaseDurationFormula: "24",
          actionModifiableDurationFormula: "98",
          skillExtraActionType: "Chanting",
          chargingBaseDurationFormula: "0",
          chargingModifiableDurationFormula: "0",
          chantingBaseDurationFormula: "0",
          chantingModifiableDurationFormula: "8",
          skillStartupFramesFormula: "0",
          belongToskillId: "",
          description: null,
          skillCost: [
            {
              id: "",
              name: "MP Cost",
              costFormula: "p.mp = p.mp - 500",
              skillEffectId: null,
            },
          ],
          skillYield: [
            {
              id: "",
              yieldFormula: "1+1",
              name: "Damage",
              skillEffectId: null,
              yieldType: "ImmediateEffect",
              mutationTimingFormula: null,
            },
          ],
        },
      },
    ]
  } satisfies skillSequenceList,
  skillSequence2: {
    name: "skillSequence2",
    data: [
      {
        id: "",
        state: "PUBLIC",
        skillTreeName: "MAGIC",
        name: "冲击波",
        skillDescription: "",
        level: 7,
        weaponElementDependencyType: "TRUE",
        element: "NO_ELEMENT",
        skillType: "ACTIVE_SKILL",
        skillEffect: {
          id: "",
          description: null,
          actionBaseDurationFormula: "13",
          actionModifiableDurationFormula: "48",
          skillExtraActionType: "Chanting",
          chargingBaseDurationFormula: "0",
          chargingModifiableDurationFormula: "0",
          chantingBaseDurationFormula: "0",
          chantingModifiableDurationFormula: "max(0,min((2 - (p.lv - 1) * 0.25),(1 - (p.lv - 5) * 0.5)))",
          skillStartupFramesFormula: "0",
          belongToskillId: "",
          skillCost: [
            {
              id: "",
              name: "MP Cost",
              costFormula: "p.mp = p.mp - 200",
              skillEffectId: null,
            },
          ],
          skillYield: [
            {
              id: "",
              name: "Damage",
              yieldType: "ImmediateEffect",
              yieldFormula: "m.hp - (s.vMatk + 200) * 5",
              mutationTimingFormula: null,
              skillEffectId: null,
            },
            // {
            //   id: "",
            //   name: "MP Cost half",
            //   yieldType: "PersistentEffect",
            //   yieldFormula: "",
            //   skillEffectId: null,
            //   mutationTimingFormula: "false",
            // },
          ],
        },
      },
      {
        id: "",
        state: "PUBLIC",
        skillTreeName: "MAGIC",
        name: "爆能",
        level: 10,
        weaponElementDependencyType: "TRUE",
        element: "NO_ELEMENT",
        skillType: "ACTIVE_SKILL",
        skillDescription: "",
        skillEffect: {
          id: "",
          actionBaseDurationFormula: "24",
          actionModifiableDurationFormula: "98",
          skillExtraActionType: "Chanting",
          chargingBaseDurationFormula: "0",
          chargingModifiableDurationFormula: "0",
          chantingBaseDurationFormula: "0",
          chantingModifiableDurationFormula: "8",
          skillStartupFramesFormula: "0",
          belongToskillId: "",
          description: null,
          skillCost: [
            {
              id: "",
              name: "MP Cost",
              costFormula: "p.mp = p.mp - 500",
              skillEffectId: null,
            },
          ],
          skillYield: [
            {
              id: "",
              yieldFormula: "1+1",
              name: "Damage",
              skillEffectId: null,
              yieldType: "ImmediateEffect",
              mutationTimingFormula: null,
            },
          ],
        },
      },
    ]
  } satisfies skillSequenceList,
};
