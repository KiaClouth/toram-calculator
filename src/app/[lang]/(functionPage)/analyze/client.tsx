"use client";
import * as math from "mathjs";
import React, { useEffect, useRef, useState } from "react";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";

import { useStore } from "~/app/store";
import Button from "../../_components/button";
import Dialog from "../../_components/dialog";
import {
  type computeInput,
  type computeOutput,
  type tSkill,
  dynamicTotalValue,
  type FrameData,
} from "./worker";
import { ObjectRenderer } from "./objectRender";
import LongSearchBox from "./monsterSearchBox";
import { computeMonsterAugmentedList } from "../monster/client";
import { Monster } from "~/schema/monster";
import { Character } from "~/schema/character";
import { defaultStatistics } from "~/schema/statistics";
import { defaultModifiersList } from "~/schema/modifiersList";
import { defaultConsumable } from "~/schema/consumable";
import { defaultSkill } from "~/schema/skill";
import { defaultPet } from "~/schema/pet";

export type skillSequenceList = {
  name: string;
  data: tSkill[];
};

export interface Props {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  monsterList: Monster[];
  characterList: Character[];
}



export const test = {
  character: {
    id: "",
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
      name: "暴击残酷之翼",
      mainWeaponType: "MAGIC_DEVICE",
      baseAtk: 194,
      refinement: 15,
      stability: 70,
      element: "LIGHT",
      crystal: [
        {
          id: "",
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
          createdAt: new Date(),
          createdByUserId: "",
          updatedAt: new Date(),
          updatedByUserId: "",
          extraDetails: "",
          dataSources: "",
          statistics: defaultStatistics,
          statisticsId: "",
        },
        {
          id: "",
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
          createdAt: new Date(),
          createdByUserId: "",
          updatedAt: new Date(),
          updatedByUserId: "",
          extraDetails: "",
          dataSources: "",
          statistics: defaultStatistics,
          statisticsId: "",
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
      createdAt: new Date(),
      createdByUserId: "",
      updatedAt: new Date(),
      updatedByUserId: "",
      extraDetails: "",
      dataSources: "",
      statistics: defaultStatistics,
      statisticsId: "",
    },
    mainWeaponId: "",
    subWeapon: {
      id: "",
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
      createdAt: new Date(),
      createdByUserId: "",
      updatedAt: new Date(),
      updatedByUserId: "",
      extraDetails: "",
      dataSources: "",
      statistics: defaultStatistics,
      statisticsId: "",
    },
    subWeaponId: "",
    bodyArmor: {
      id: "",
      name: "冒险者服装",
      bodyArmorType: "NORMAL",
      refinement: 0,
      baseDef: 0,
      crystal: [
        {
          id: "",
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
          createdAt: new Date(),
          createdByUserId: "",
          updatedAt: new Date(),
          updatedByUserId: "",
          extraDetails: "",
          dataSources: "",
          statistics: defaultStatistics,
          statisticsId: "",
        },
        {
          id: "",
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
          createdAt: new Date(),
          createdByUserId: "",
          updatedAt: new Date(),
          updatedByUserId: "",
          extraDetails: "",
          dataSources: "",
          statistics: defaultStatistics,
          statisticsId: "",
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
      createdAt: new Date(),
      createdByUserId: "",
      updatedAt: new Date(),
      updatedByUserId: "",
      extraDetails: "",
      dataSources: "",
      statistics: defaultStatistics,
      statisticsId: "",
    },
    bodyArmorId: "",
    additionalEquipment: {
      id: "",
      name: "饼干腰翼",
      refinement: 0,
      crystal: [
        {
          id: "",
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
          createdAt: new Date(),
          createdByUserId: "",
          updatedAt: new Date(),
          updatedByUserId: "",
          extraDetails: "",
          dataSources: "",
          statistics: defaultStatistics,
          statisticsId: "",
        },
        {
          id: "",
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
          createdAt: new Date(),
          createdByUserId: "",
          updatedAt: new Date(),
          updatedByUserId: "",
          extraDetails: "",
          dataSources: "",
          statistics: defaultStatistics,
          statisticsId: "",
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
      createdAt: new Date(),
      createdByUserId: "",
      updatedAt: new Date(),
      updatedByUserId: "",
      extraDetails: "",
      dataSources: "",
      statistics: defaultStatistics,
      statisticsId: "",
    },
    additionalEquipmentId: "",
    specialEquipment: {
      id: "",
      name: "读星提灯",
      crystal: [
        {
          id: "",
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
          createdAt: new Date(),
          createdByUserId: "",
          updatedAt: new Date(),
          updatedByUserId: "",
          extraDetails: "",
          dataSources: "",
          statistics: defaultStatistics,
          statisticsId: "",
        },
        {
          id: "",
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
          createdAt: new Date(),
          createdByUserId: "",
          updatedAt: new Date(),
          updatedByUserId: "",
          extraDetails: "",
          dataSources: "",
          statistics: defaultStatistics,
          statisticsId: "",
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
      createdAt: new Date(),
      createdByUserId: "",
      updatedAt: new Date(),
      updatedByUserId: "",
      extraDetails: "",
      dataSources: "",
      statistics: defaultStatistics,
      statisticsId: "",
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
    createdAt: new Date(),
    createdByUserId: "",
    updatedAt: new Date(),
    updatedByUserId: "",
    extraDetails: "",
    statistics: defaultStatistics,
    statisticsId: "",
  } satisfies Character,
  monster: {
    id: "",
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
    dataSources: "",
    createdAt: new Date(),
    createdByUserId: "",
    updatedAt: new Date(),
    updatedByUserId: "",
    extraDetails: "",
    statistics: defaultStatistics,
    statisticsId: "",
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

export default function AnalyzePageClient(props: Props) {
  const { dictionary } = props;

  // 状态管理参数
  const workerRef = useRef<Worker>();
  const { monsterList, setMonsterList } = useStore((state) => state.monsterPage);
  const { characterList, setCharacterList } = useStore((state) => state.characterPage);
  const { monster, setMonster, character, setCharacter } = useStore((state) => state);
  const { analyzeDialogState, setAnalyzeDialogState } = useStore((state) => state.analyzePage);
  const [computeResult, setComputeResult] = useState<React.ReactNode>(null);
  const [dialogFrameData, setDialogFrameData] = useState<FrameData | null>(null);
  const [dialogMeberIndex, setDialogMeberIndex] = useState<number>(0);
  const [defaultMonsterList] = useState(props.monsterList);
  const [team, setTeam] = useState<computeInput["arg"]["team"]>([
    {
      config: test.character,
      actionQueue: test.skillSequence1.data,
    },
    {
      config: test.character,
      actionQueue: test.skillSequence2.data,
    },
  ]);

  useEffect(() => {
    console.log("--ComboAnalyze Client Render");
    setMonsterList(computeMonsterAugmentedList(defaultMonsterList, dictionary));
    setCharacterList(props.characterList);

    setCharacter(test.character);
    setMonster(test.monster);

    // 预定义的颜色数组
    const colors: string[] = [];
    // 生成 14 个颜色值
    for (let i = 0; i < 15; i++) {
      const hue = math.floor((i * (360 / 15)) % 360); // 色相值，从蓝色开始逐渐增加
      const saturation = "60%"; // 饱和度设置为 100%
      const lightness = "50%"; // 亮度设置为 50%

      // 将 HSL 颜色值转换为 CSS 格式的字符串
      const color = `hsl(${hue}, ${saturation}, ${lightness})`;

      colors.push(color);
    }

    function stringToColor(str: string): string {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i);
      }

      // 将散列值映射到颜色数组的索引范围内
      const index = hash % colors.length;

      // 返回对应索引的颜色值
      return colors[index]!;
    }

    workerRef.current = new Worker(new URL("./worker.ts", import.meta.url));

    workerRef.current.onmessage = (e: MessageEvent<computeOutput>) => {
      const { type, computeResult } = e.data;
      switch (type) {
        case "progress":
          {
            const result = computeResult as string;
            setComputeResult(<div className="Result my-10 flex items-end">{result}</div>);
          }
          break;
        case "success":
          {
            const result = computeResult as FrameData[];
            const lastFrameData = result.at(-1);
            const RemainingHp = lastFrameData ? dynamicTotalValue(lastFrameData.monsterData.hp) : 0;
            const totalDamge = (lastFrameData?.monsterData.hp.baseValue ?? 0) - RemainingHp;
            const totalDuration = result.length / 60;
            const dps = totalDamge / totalDuration;
            setComputeResult(
              <>
                <div className="Result my-10 flex flex-col gap-4 lg:flex-row lg:items-end">
                  <div className="DPS flex flex-col gap-2 ">
                    <span className="Key py-2 text-sm">DPS</span>
                    <span className="Value border-y-[1px] border-brand-color-1st p-4 text-6xl lg:border-none lg:p-0 lg:text-8xl lg:text-accent-color">
                      {math.floor(math.abs(dps))}
                    </span>
                  </div>
                  <div className="OtherData flex flex-1 gap-2">
                    <div className="Duration flex flex-1 flex-col gap-1 rounded bg-transition-color-8 lg:p-4">
                      <span className="Key p-1 text-sm text-accent-color-70">总耗时</span>
                      <span className="Value p-1 text-xl lg:text-2xl lg:text-accent-color">
                        {math.floor(math.abs(totalDuration))} 秒
                      </span>
                    </div>
                    <div className="Duration flex flex-1 flex-col gap-1 rounded bg-transition-color-8 lg:p-4">
                      <span className="Key p-1 text-sm text-accent-color-70">总伤害</span>
                      <span className="Value p-1 text-xl lg:text-2xl lg:text-accent-color">
                        {math.floor(math.abs(totalDamge) / 10000)} 万
                      </span>
                    </div>
                    <div className="Duration flex flex-1 flex-col gap-1 rounded bg-transition-color-8 lg:p-4">
                      <span className="Key p-1 text-sm text-accent-color-70">怪物剩余HP</span>
                      <span className="Value p-1 text-xl lg:text-2xl lg:text-accent-color">
                        {math.floor(math.abs(RemainingHp) / 10000)}万
                      </span>
                    </div>
                  </div>
                </div>
                <div className="TimeLine flex flex-col gap-4">
                  <div className="Title border-b-2 border-brand-color-1st p-2">
                    <span className="Key p-1 ">时间轴</span>
                  </div>
                  <div className="Content flex flex-1 flex-wrap gap-y-4 shadow-transition-color-20 drop-shadow-2xl">
                    {result.map((frameData, frame) => {
                      return (
                        <div
                          key={"frameData" + frame}
                          className={`FrameData${frame} flex flex-col justify-around gap-1`}
                        >
                          {frameData.teamState.map((member, memberIndex) => {
                            const color = stringToColor(member?.skillData.name ?? "");
                            return frame === 0 ? (
                              <button className="MemberName p-1 text-sm " key={"member" + memberIndex}>
                                {member?.name}
                              </button>
                            ) : (
                              <button
                                className={`MemberData group relative h-4 px-[1px] `}
                                key={"member" + memberIndex}
                                style={{
                                  backgroundColor: member ? color : "transparent",
                                }}
                                onClick={() => {
                                  console.log("点击了队员：", member?.name, "的第：", frame, "帧");
                                  if (member) {
                                    setDialogFrameData(frameData);
                                    setAnalyzeDialogState(true);
                                  }
                                }}
                              >
                                {member ? (
                                  <div className="absolute -left-4 bottom-14 z-10 hidden w-fit min-w-[300px] flex-col gap-2 rounded bg-primary-color p-2 text-left shadow-2xl shadow-transition-color-20 backdrop-blur-xl lg:group-hover:z-20 lg:group-hover:flex">
                                    <div className="FrameAttr flex flex-col gap-1 bg-transition-color-8 p-1">
                                      <span className="Title font-bold">队员: {member?.name}</span>
                                      <span className="Content">
                                        第 {math.floor(frame / 60)} 秒的第 {frame % 60} 帧
                                        <br />
                                      </span>

                                      <span className="Content ">
                                        技能 {member?.actionIndex ?? 0 + 1} {member?.skillData.name} 的第：
                                        {member?.actionFrameIndex} / {member?.skillData.skillDuration} 帧
                                        <br />
                                      </span>
                                    </div>
                                  </div>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>,
            );
          }
          break;
        case "error":
          {
            setComputeResult(<div className="Result my-10 flex items-end">发生错误</div>);
          }
          break;
        default:
          break;
      }
    };

    workerRef.current.onerror = (error) => {
      console.error("Worker error:", error);
    };

    return () => {
      console.log("--ComboAnalyze Client Unmount");
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [
    defaultMonsterList,
    dictionary,
    props.characterList,
    props.monsterList,
    setAnalyzeDialogState,
    setCharacter,
    setCharacterList,
    setMonster,
    setMonsterList,
  ]);

  const startCompute = () => {
    setComputeResult(null);
    const workerMessage: computeInput = {
      type: "start",
      arg: {
        dictionary: dictionary,
        team: team,
        monster: monster,
      },
    };
    if (workerRef.current) {
      workerRef.current.postMessage(workerMessage);
    }
  };

  // const stopCompute = () => {
  //   const workerMessage: computeInput = {
  //     type: "stop",
  //   };
  //   if (workerRef.current) {
  //     workerRef.current.postMessage(workerMessage);
  //   }
  // };

  // const terminateWorker = () => {
  //   const workerMessage: computeInput = {
  //     type: "stop",
  //   };
  //   if (workerRef.current) {
  //     workerRef.current.postMessage(workerMessage);
  //     workerRef.current.terminate();
  //   }
  // };

  return (
    <main className="flex flex-col lg:w-[calc(100dvw-96px)] lg:flex-row">
      <div
        className={`Module1 pointer-events-none invisible fixed left-0 top-0 z-50 flex-none basis-[0px] -translate-x-full border-transition-color-8 bg-primary-color opacity-0 backdrop-blur-xl lg:sticky lg:z-0 lg:translate-x-0 lg:border-x-1.5 lg:bg-transition-color-8`}
      >
        <div
          className={`Content flex h-dvh w-dvw flex-col gap-4 overflow-y-auto px-6 pt-8 lg:absolute lg:left-0 lg:top-0 lg:w-[260px]`}
        >
          <div className="Title flex items-center justify-between">
            <h1 className="text-lg">{dictionary.ui.filter}</h1>
            <Button level="tertiary">X</Button>
          </div>
        </div>
      </div>
      <div className="Module2 flex flex-1 px-3 backdrop-blur-xl">
        <div className="LeftArea sticky top-0 z-10 flex-1"></div>
        <div
          className={`ModuleContent h-[calc(100dvh-67px)] w-full flex-col overflow-y-auto lg:h-dvh lg:max-w-[1536px]`}
        >
          <div className="Title sticky left-0 mt-3 flex flex-col gap-9 py-5 lg:pt-20">
            <div className="Row flex flex-col items-center justify-between gap-10 lg:flex-row lg:justify-start lg:gap-4">
              <h1 className="Text text-left text-3xl lg:bg-transparent lg:text-4xl">
                {dictionary.ui.analyze.pageTitle}
              </h1>
              <div className="Control flex flex-1 gap-2">
                <input
                  type="search"
                  placeholder={dictionary.ui.searchPlaceholder}
                  className="w-full flex-1 rounded-sm border-transition-color-20 bg-transition-color-8 px-3 py-2 backdrop-blur-xl placeholder:text-accent-color-50 hover:border-accent-color-70 hover:bg-transition-color-8
                  focus:border-accent-color-70 focus:outline-none lg:flex-1 lg:rounded-none lg:border-b-1.5 lg:bg-transparent lg:px-5 lg:font-normal"
                />
              </div>
            </div>
            <div className="Discription my-3 hidden rounded-sm bg-transition-color-8 p-3 lg:block">
              {dictionary.ui.analyze.description}
            </div>
            <div></div>
          </div>
          <div className="Content flex flex-col gap-4">
            <div className="MonsterConfig flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="Title flex gap-4">
                <span className="Key">怪物：</span>
                <span className="MonsterName font-bold">{monster.name}</span>
              </div>
              <LongSearchBox dictionary={dictionary} monsterList={monsterList} setMonster={setMonster} />
            </div>
            <div className="TeamConfig flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="Title flex flex-col gap-4">队伍配置：</div>
              <div className="Content flex flex-col">
                {team.map((member, index) => {
                  return (
                    <div
                      key={"member" + index}
                      className="Member flex flex-col gap-4 border-b border-transition-color-20 p-4 lg:flex-row lg:items-center"
                    >
                      <div className="CharacterConfig flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="Title flex gap-4">
                          <span className="Key">角色：</span>
                          <span className="CharacterName font-bold">{member.config.name}</span>
                        </div>
                      </div>
                      <div className="SkillSequence flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="Title">流程：</div>
                        <div className="Content flex flex-wrap gap-2">
                          {member.actionQueue.map((skill, index) => {
                            return (
                              <Button key={index} size="sm" level="tertiary">
                                {skill.name}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button size="sm" level="primary" onClick={startCompute}>
              开始计算
            </Button>
            {computeResult}
          </div>
        </div>
        <div className="RightArea sticky top-0 z-10 flex-1"></div>
      </div>

      <Dialog state={analyzeDialogState} setState={setAnalyzeDialogState}>
        {analyzeDialogState && (
          <div className="Content flex w-dvw flex-col overflow-y-auto p-2 lg:p-4 2xl:w-[1536px]">
            <div className="Title flex items-center gap-6">
              {/* <div className="h-[2px] flex-1 bg-accent-color"></div> */}
              <span className="text-lg font-bold lg:text-2xl">当前帧属性</span>
              <div className="h-[2px] flex-1 bg-accent-color"></div>
            </div>
            <div className="Content flex flex-col gap-4 overflow-y-auto">
              <div className="FrameAttr mt-4 flex flex-col gap-1 bg-transition-color-8 p-2 lg:flex-row">
                <span className="Content">
                  帧信息： {math.floor((dialogFrameData?.frame ?? 0) / 60)} 秒的第 {(dialogFrameData?.frame ?? 0) % 60}{" "}
                  帧
                </span>
              </div>
              <div className="CharacterData flex flex-col gap-1">
                <div className="Title sticky top-0 z-10 flex items-center gap-6 bg-primary-color pt-4">
                  <span className="Title text-base font-bold lg:text-xl">Character</span>
                  <div className="h-[1px] flex-1 bg-brand-color-1st"></div>
                </div>
                <div className="Content flex flex-wrap outline-[1px] lg:gap-1">
                  <div className="Tab flex flex-wrap gap-1">
                    {dialogFrameData?.teamState.map((member, memberIndex) => {
                      return (
                        <Button
                          key={"member" + memberIndex}
                          onClick={() => setDialogMeberIndex(memberIndex)}
                          size="sm"
                          level="tertiary"
                        >
                          {member?.name}
                        </Button>
                      );
                    })}
                  </div>
                  {dialogFrameData?.teamState.map((member, memberIndex) => {
                    return (
                      <ObjectRenderer
                        key={"member" + memberIndex}
                        data={member?.characterData}
                        dictionary={dictionary}
                        display={dialogMeberIndex === memberIndex}
                      />
                    );
                  })}
                  <div className="Title flex items-center gap-6 bg-primary-color pt-4">
                    <span className="Title text-base font-bold">Skill</span>
                    <div className="h-[1px] flex-1 bg-brand-color-1st"></div>
                  </div>
                  {dialogFrameData?.teamState.map((member, memberIndex) => {
                    return (
                      <ObjectRenderer
                        key={"member" + memberIndex}
                        data={member?.skillData}
                        dictionary={dictionary}
                        display={dialogMeberIndex === memberIndex}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="MonsterData flex flex-col gap-1">
                <div className="Title sticky top-0 z-10 flex items-center gap-6 bg-primary-color pt-4">
                  <span className="Title text-base font-bold lg:text-xl">Monster</span>
                  <div className="h-[1px] flex-1 bg-brand-color-1st"></div>
                </div>
                <div className="Content flex flex-wrap outline-[1px] lg:gap-1">
                  {dialogFrameData ? (
                    <ObjectRenderer dictionary={dictionary} data={dialogFrameData.monsterData} display />
                  ) : null}
                </div>
              </div>
            </div>
            <div className="FunctionArea flex flex-col justify-end gap-4 bg-primary-color">
              <div className="h-[1px] flex-none bg-brand-color-1st"></div>
              <div className="btnGroup flex gap-2">
                <Button
                  onClick={() => {
                    setAnalyzeDialogState(false);
                  }}
                >
                  {dictionary.ui.close} [Esc]
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </main>
  );
}
