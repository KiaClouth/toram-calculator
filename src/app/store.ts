import { create } from "zustand";
import { produce } from "immer";
import { type Monster, defaultMonster } from "~/schema/monster";
import { type Skill, defaultSkill } from "~/schema/skill";
import { type Crystal, defaultCrystal } from "~/schema/crystal";
import { type Character, defaultCharacter } from "~/schema/characterSchema";
import { type Analyzer, defaultAnalyzer } from "~/schema/analyzer";

// if you need middleware
// import { devtools, persist } from 'zustand/middleware'

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
