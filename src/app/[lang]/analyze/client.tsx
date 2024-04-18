"use client";
import React, { useEffect } from "react";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";

import type {
  _Character,
  _Skill,
  CharacterState,
  FrameData,
} from "./analyzeType";
import { Prisma } from "@prisma/client";

const a:Prisma.Character$petArgs={}

export interface Props {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}

export default function AnalyzePageClient(props: Props) {
  const { dictionary, session } = props;
  const skillSequence: _Skill[] = [
    {
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "冲击波",
      level: 7,
      weaponElementDependencyType: "TRUE",
      element: "NO_ELEMENT",
      skillType: "ACTIVE_SKILL",
      skillEffect: [
        {
          condition: "MAINWEAPON_TYPE == MAFIC_DEVICE",
          cost: [
            {
              id: "",
              costType: "C_MP",
              costFormula: "200",
              skillEffectId: null,
            },
          ],
          yield: [
            {
              id: "",
              triggerTiming: "ON_USE",
              delay: 33,
              yieldType: "M_HP",
              yieldFormula: "(C_VMATK + 200) * 500%",
              skillEffectId: null,
              durationType: "SKILL",
              durationValue: 0,
            },
            {
              id: "",
              triggerTiming: "NEXT_SKILL",
              delay: 0,
              durationType: "UNLIMITED",
              durationValue: 0,
              yieldType: "C_MP",
              yieldFormula: "",
              skillEffectId: null,
            },
          ],
          id: "",
          actionBaseDuration: 13,
          actionModifiableDuration: 48,
          belongToskillId: "",
          castingDurationFormula: "",
        },
      ],
      createdByUserId: null,
      updatedByUserId: null,
      viewCount: 0,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageTimestamps: [],
      viewTimestamps: [],
    },
    {
      skillEffect: [
        {
          condition: "",
          cost: [
            {
              costFormula: "",
              id: "",
              costType: "C_MP",
              skillEffectId: null,
            },
          ],
          yield: [
            {
              yieldFormula: "",
              id: "",
              triggerTiming: "ON_USE",
              delay: 30,
              durationType: "SKILL",
              durationValue: 0,
              yieldType: "M_HP",
              skillEffectId: null,
            },
          ],
          id: "",
          actionBaseDuration: 24,
          actionModifiableDuration: 98,
          belongToskillId: "",
          castingDurationFormula: "",
        },
      ],
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "爆能",
      level: 10,
      weaponElementDependencyType: "TRUE",
      element: "NO_ELEMENT",
      skillType: "ACTIVE_SKILL",
      createdByUserId: null,
      updatedByUserId: null,
      viewCount: 0,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageTimestamps: [],
      viewTimestamps: [],
    },
  ];

  const testCharacter: _Character = {
    id: "",
    state: "PRIVATE",
    name: "",
    lv: 265,
    petId: null,
    modifiersListId: null,
    createdByUserId: null,
    viewCount: 0,
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    usageTimestamps: [],
    viewTimestamps: [],
    baseAbi: {
      baseStr: 0,
      baseInt: 430,
      baseVit: 0,
      baseAgi: 0,
      baseDex: 247,
      characterId: "",
    },
    specialAbi: {
      specialAbiType: "NULL",
      value: 0,
      characterId: "",
    },
    equipmentList: {
      characterId: "",
      mainWeaponId: null,
      subWeaponId: null,
      bodyArmorId: null,
      additionalEquipmentId: null,
      specialEquipmentId: null,
      mainWeapon: {
        id: "",
        state: "PRIVATE",
        name: "",
        mainWeaType: "NO_WEAPOEN",
        baseAtk: 0,
        refinement: 0,
        stability: 0,
        element: "NO_ELEMENT",
        modifiersListId: null,
        createdByUserId: null,
        updatedByUserId: null,
        viewCount: 0,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageTimestamps: [],
        viewTimestamps: []
      },
      subWeapon: {
        id: "",
        state: "PRIVATE",
        name: "",
        subWeaType: "NO_WEAPOEN",
        baseAtk: 0,
        refinement: 0,
        stability: 0,
        element: "NO_ELEMENT",
        modifiersListId: null,
        createdByUserId: null,
        updatedByUserId: null,
        viewCount: 0,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageTimestamps: [],
        viewTimestamps: []
      },
      bodyArmor: {
        id: "",
        state: "PRIVATE",
        name: "",
        bodyArmorType: "LIGHT",
        refinement: 0,
        modifiersListId: null,
        createdByUserId: null,
        updatedByUserId: null,
        viewCount: 0,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageTimestamps: [],
        viewTimestamps: []
      },
      addEquipment: {
        id: "",
        state: "PRIVATE",
        name: "",
        refinement: 0,
        modifiersListId: null,
        createdByUserId: null,
        updatedByUserId: null,
        viewCount: 0,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageTimestamps: [],
        viewTimestamps: []
      },
      spcialEquipment: {
        id: "",
        state: "PRIVATE",
        name: "",
        modifiersListId: null,
        createdByUserId: null,
        updatedByUserId: null,
        viewCount: 0,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageTimestamps: [],
        viewTimestamps: []
      }
    },
    fashion: {
      modifiersListId: null,
      updatedAt: new Date(),
      characterId: "",
    },
    cuisine: {
      modifiersListId: null,
      updatedAt: new Date(),
      characterId: "",
    },
    consumableList: [],
    skill: {
      updatedAt: new Date(),
      characterId: "",
    },
    combos: [],
    pet: {
      id: "",
      state: "PRIVATE",
      name: null,
      createdByUserId: null,
      updatedByUserId: null,
      viewCount: 0,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageTimestamps: [],
      viewTimestamps: [],
    },
    modifiersList: {
      id: "",
    },
  };

  const initialCharacterState: CharacterState = {
    systemAttributes: {
      pPie: {
        baseValue: 0,
        modifiers: [],
      },
      mPie: {
        baseValue: 0,
        modifiers: [],
      },
      nDis: {
        baseValue: 100,
        modifiers: [],
      },
      fDis: {
        baseValue: 100,
        modifiers: [],
      },
      crT: {
        baseValue: 0,
        modifiers: [],
      },
      cdT: {
        baseValue: 50,
        modifiers: [],
      },
      stro: {
        baseValue: 100,
        modifiers: [],
      },
      total: {
        baseValue: 100,
        modifiers: [],
      },
      final: {
        baseValue: 100,
        modifiers: [],
      },
      am: {
        baseValue: 100,
        modifiers: [],
      },
    },
    primaryAttributes: {
      lv: 0,
      abi: {
        str: {
          baseValue: 0,
          modifiers: [],
        },
        int: {
          baseValue: 0,
          modifiers: [],
        },
        vit: {
          baseValue: 0,
          modifiers: [],
        },
        agi: {
          baseValue: 0,
          modifiers: [],
        },
        dex: {
          baseValue: 0,
          modifiers: [],
        },
        luc: {
          baseValue: 0,
          modifiers: [],
        },
        tec: {
          baseValue: 0,
          modifiers: [],
        },
        men: {
          baseValue: 0,
          modifiers: [],
        },
        cri: {
          baseValue: 0,
          modifiers: [],
        },
      },
      equipment: {
        mainWeapon: {
          type: "NO_WEAPOEN",
          baseAtk: {
            baseValue: 0,
            modifiers: [],
          },
          refinement: 0,
          stability: 0,
        },
        subWeapon: {
          type: "NO_WEAPOEN",
          baseAtk: {
            baseValue: 0,
            modifiers: [],
          },
          refinement: 0,
          stability: 0,
        },
        BodyArmor: {
          type: "NORMAL",
          baseDef: 0,
          refinement: 0,
          stability: 0,
        },
      },
    },
    derivedAttributes: {
      maxHP: {
        baseValue: 0,
        modifiers: [],
      },
      maxMP: {
        baseValue: 0,
        modifiers: [],
      },
      mainWeaAtk: {
        baseValue: 0,
        modifiers: [],
      },
      subWeaAtk: {
        baseValue: 0,
        modifiers: [],
      },
      totalWeaAtk: {
        baseValue: 0,
        modifiers: [],
      },
      pStab: {
        baseValue: 0,
        modifiers: [],
      },
      mStab: {
        baseValue: 0,
        modifiers: [],
      },
      pCr: {
        baseValue: 0,
        modifiers: [],
      },
      pCd: {
        baseValue: 0,
        modifiers: [],
      },
      pAtk: {
        baseValue: 0,
        modifiers: [],
      },
      mAtk: {
        baseValue: 0,
        modifiers: [],
      },
      aspd: {
        baseValue: 0,
        modifiers: [],
      },
      cspd: {
        baseValue: 0,
        modifiers: [],
      },
    },
  };

  function calculateFrameData(
    skillSequence: _Skill[],
    initialCharacterState: CharacterState,
  ): FrameData[] {
    const frameData: FrameData[] = [];
    const characterState = initialCharacterState;

    for (let frame = 0; frame < 360; frame++) {
      // 应用技能效果到角色状态上
      // 这里需要根据技能属性和当前角色状态来计算新的角色状态
      // 例如：characterState = applySkillEffect(characterState, skillSequence[frame]);

      // 将当前帧的角色状态数据添加到结果数组中
      frameData.push({ frame, characterState });
    }

    return frameData;
  }

  useEffect(() => {
    console.log("comboAnalyze");
  }, []);

  return (
    <main className="flex flex-col lg:w-[calc(100dvw-96px)] lg:flex-row">
      <div className="Module2 flex flex-1 px-3 backdrop-blur-xl">
        <div className="LeftArea sticky top-0 z-10 flex-1"></div>
        <div className="ModuleContent h-[calc(100dvh-67px)] w-full flex-col overflow-auto lg:h-dvh lg:w-[calc(100dvw-130px)] 2xl:w-[1536px]">
          <div className="Title sticky left-0 mt-3 flex flex-col gap-9 py-5 lg:pt-20">
            <div className="Row flex flex-col items-center justify-between gap-10 lg:flex-row lg:justify-start lg:gap-4">
              <h1 className="Text text-left text-3xl lg:bg-transparent lg:text-4xl">
                {dictionary.ui.monster.pageTitle}
              </h1>
              <div className="Control flex flex-1 gap-2">
                <input
                  type="search"
                  placeholder={dictionary.ui.monster.searchPlaceholder}
                  className="w-full flex-1 rounded-sm border-transition-color-20 bg-transition-color-8 px-3 py-2 backdrop-blur-xl placeholder:text-accent-color-50 hover:border-accent-color-70 hover:bg-transition-color-8
                  focus:border-accent-color-70 focus:outline-none lg:flex-1 lg:rounded-none lg:border-b-1.5 lg:bg-transparent lg:px-5 lg:font-normal"
                />
              </div>
            </div>
            <div className="Discription my-3 hidden rounded-sm bg-transition-color-8 p-3 lg:block">
              {dictionary.ui.monster.discription}
            </div>
            <div></div>
          </div>
          {calculateFrameData(skillSequence, initialCharacterState).map(
            (frameData) => (
              <div key={frameData.frame} className="frame">
                {JSON.stringify(frameData)}
              </div>
            ),
          )}
        </div>
        <div className="RightArea sticky top-0 z-10 flex-1"></div>
      </div>
    </main>
  );
}
