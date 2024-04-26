"use client";
import React, { useEffect } from "react";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";

import type { abiType, modifiers } from "./analyzeType";
import Dialog from "../_components/dialog";
import { defaultCharacter, defaultMonster, useBearStore } from "~/app/store";
import { type Monster, type BodyArmorType, type MainWeaType, type SubWeaType } from "@prisma/client";
import type { Character } from "~/server/api/routers/character";
import * as math from "mathjs";
import { type Skill, type SkillEffect } from "~/server/api/routers/skill";

export interface Props {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}

export default function AnalyzePageClient(props: Props) {
  const { dictionary } = props;
  const skillSequence: Skill[] = [
    {
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "CJB",
      level: 7,
      weaponElementDependencyType: "TRUE",
      element: "NO_ELEMENT",
      skillType: "ACTIVE_SKILL",
      skillEffect: [
        {
          id: "",
          actionBaseDuration: 13,
          actionModifiableDuration: 48,
          belongToskillId: "",
          castingDurationFormula: "max(0,min((2 - (skillLevel - 1) * 0.25),(1 - (skillLevel - 5) * 0.5)))",
          description: null,
          condition: "equalText(primaryAttributes.equipment.mainWeapon.type,'MAGIC_DEVICE')",
          skillCost: [
            {
              id: "",
              costFormula: "200",
              skillEffectId: null,
            },
          ],
          skillYield: [
            {
              id: "",
              triggerTimingType: "ON_USE",
              delay: 33,
              yieldFormula: "(C_VMATK + 200) * 500%",
              skillEffectId: null,
              durationType: "SKILL",
              durationValue: 0,
            },
            {
              id: "",
              triggerTimingType: "NEXT_SKILL",
              delay: 0,
              durationType: "UNLIMITED",
              durationValue: 0,
              yieldFormula: "",
              skillEffectId: null,
            },
          ],
        },
        {
          id: "",
          actionBaseDuration: 13,
          actionModifiableDuration: 48,
          belongToskillId: "",
          castingDurationFormula: "max(0,min((2 - (skillLevel - 1) * 0.25),(1 - (skillLevel - 5) * 0.5)))",
          description: null,
          condition: "equalText(primaryAttributes.equipment.mainWeapon.type,'STAFF')",
          skillCost: [
            {
              id: "",
              costFormula: "200",
              skillEffectId: null,
            },
          ],
          skillYield: [
            {
              id: "",
              triggerTimingType: "ON_USE",
              delay: 33,
              yieldFormula: "(C_VMATK + 200) * 250%",
              skillEffectId: null,
              durationType: "SKILL",
              durationValue: 0,
            },
            {
              id: "",
              triggerTimingType: "NEXT_SKILL",
              delay: 0,
              durationType: "UNLIMITED",
              durationValue: 0,
              yieldFormula: "",
              skillEffectId: null,
            },
          ],
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
      skillDescription: null,
    },
    {
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "BN",
      level: 10,
      weaponElementDependencyType: "TRUE",
      element: "NO_ELEMENT",
      skillType: "ACTIVE_SKILL",
      skillDescription: null,
      skillEffect: [
        {
          id: "",
          actionBaseDuration: 24,
          actionModifiableDuration: 98,
          belongToskillId: "",
          castingDurationFormula: "0",
          description: null,
          condition: "equalText(primaryAttributes.equipment.mainWeapon.type,'MAGIC_DEVICE')",
          skillCost: [
            {
              costFormula: "",
              id: "",
              skillEffectId: null,
            },
          ],
          skillYield: [
            {
              yieldFormula: "",
              id: "",
              triggerTimingType: "ON_USE",
              delay: 30,
              durationType: "SKILL",
              durationValue: 0,
              skillEffectId: null,
            },
          ],
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
  ];

  // 状态管理参数
  const { analyzeDialogState, setAnalyzeDialogState } = useBearStore((state) => state.analyzePage);

  class CharacterAttr {
    // 武器的能力值-属性转化率
    static weaponAbiT: Record<
      MainWeaType,
      {
        baseHit: number;
        baseAspd: number;
        weaAtk_Matk_Convert: number;
        abi_Attr_Convert: Record<
          "str" | "int" | "agi" | "dex",
          { pAtkT: number; mAtkT: number; aspdT: number; stabT: number }
        >;
      }
    > = {
      ONE_HAND_SWORD: {
        baseHit: 0.25,
        baseAspd: 100,
        abi_Attr_Convert: {
          str: {
            pAtkT: 2,
            stabT: 0.025,
            aspdT: 0.2,
            mAtkT: 0,
          },
          int: {
            mAtkT: 3,
            pAtkT: 0,
            aspdT: 0,
            stabT: 0,
          },
          agi: {
            aspdT: 4.2,
            pAtkT: 0,
            mAtkT: 0,
            stabT: 0,
          },
          dex: {
            pAtkT: 2,
            stabT: 0.075,
            mAtkT: 0,
            aspdT: 0,
          },
        },
        weaAtk_Matk_Convert: 0,
      },
      KATANA: {
        baseHit: 0.3,
        baseAspd: 200,
        abi_Attr_Convert: {
          str: {
            pAtkT: 1.5,
            stabT: 0.075,
            aspdT: 0.3,
            mAtkT: 0,
          },
          int: {
            mAtkT: 1.5,
            pAtkT: 0,
            aspdT: 0,
            stabT: 0,
          },
          agi: {
            aspdT: 3.9,
            pAtkT: 0,
            mAtkT: 0,
            stabT: 0,
          },
          dex: {
            pAtkT: 2.5,
            stabT: 0.025,
            mAtkT: 0,
            aspdT: 0,
          },
        },
        weaAtk_Matk_Convert: 0,
      },
      TWO_HANDS_SWORD: {
        baseHit: 0.15,
        baseAspd: 50,
        abi_Attr_Convert: {
          str: {
            pAtkT: 3,
            aspdT: 0.2,
            mAtkT: 0,
            stabT: 0,
          },
          int: {
            mAtkT: 3,
            pAtkT: 0,
            aspdT: 0,
            stabT: 0,
          },
          agi: {
            aspdT: 2.2,
            pAtkT: 0,
            mAtkT: 0,
            stabT: 0,
          },
          dex: {
            pAtkT: 1,
            stabT: 0.1,
            mAtkT: 0,
            aspdT: 0,
          },
        },
        weaAtk_Matk_Convert: 0,
      },
      BOW: {
        baseHit: 0.1,
        baseAspd: 75,
        abi_Attr_Convert: {
          str: {
            pAtkT: 1,
            stabT: 0.05,
            mAtkT: 0,
            aspdT: 0,
          },
          int: {
            mAtkT: 3,
            pAtkT: 0,
            aspdT: 0,
            stabT: 0,
          },
          agi: {
            aspdT: 3.1,
            pAtkT: 0,
            mAtkT: 0,
            stabT: 0,
          },
          dex: {
            pAtkT: 3,
            stabT: 0.05,
            aspdT: 0.2,
            mAtkT: 0,
          },
        },
        weaAtk_Matk_Convert: 0,
      },
      BOWGUN: {
        baseHit: 0.05,
        baseAspd: 100,
        abi_Attr_Convert: {
          str: {
            stabT: 0.05,
            pAtkT: 0,
            mAtkT: 0,
            aspdT: 0,
          },
          int: {
            mAtkT: 3,
            pAtkT: 0,
            aspdT: 0,
            stabT: 0,
          },
          agi: {
            aspdT: 2.2,
            pAtkT: 0,
            mAtkT: 0,
            stabT: 0,
          },
          dex: {
            pAtkT: 4,
            aspdT: 0.2,
            mAtkT: 0,
            stabT: 0,
          },
        },
        weaAtk_Matk_Convert: 0,
      },
      STAFF: {
        baseHit: 0.3,
        baseAspd: 60,
        abi_Attr_Convert: {
          str: {
            pAtkT: 3,
            stabT: 0.05,
            mAtkT: 0,
            aspdT: 0,
          },
          int: {
            mAtkT: 4,
            pAtkT: 1,
            aspdT: 0.2,
            stabT: 0,
          },
          agi: {
            aspdT: 1.8,
            pAtkT: 0,
            mAtkT: 0,
            stabT: 0,
          },
          dex: {
            aspdT: 0.2,
            pAtkT: 0,
            mAtkT: 0,
            stabT: 0,
          },
        },
        weaAtk_Matk_Convert: 1,
      },
      MAGIC_DEVICE: {
        baseHit: 0.1,
        baseAspd: 90,
        abi_Attr_Convert: {
          str: {
            pAtkT: 0,
            mAtkT: 0,
            aspdT: 0,
            stabT: 0,
          },
          int: {
            mAtkT: 4,
            pAtkT: 2,
            aspdT: 0.2,
            stabT: 0,
          },
          agi: {
            pAtkT: 2,
            aspdT: 4,
            mAtkT: 0,
            stabT: 0,
          },
          dex: {
            stabT: 0.1,
            pAtkT: 0,
            mAtkT: 0,
            aspdT: 0,
          },
        },
        weaAtk_Matk_Convert: 1,
      },
      KNUCKLE: {
        baseHit: 0.1,
        baseAspd: 100,
        abi_Attr_Convert: {
          str: {
            aspdT: 0.1,
            pAtkT: 0,
            mAtkT: 0,
            stabT: 0,
          },
          int: {
            mAtkT: 4,
            pAtkT: 0,
            aspdT: 0,
            stabT: 0,
          },
          agi: {
            pAtkT: 2,
            aspdT: 4.6,
            mAtkT: 0,
            stabT: 0,
          },
          dex: {
            pAtkT: 0.5,
            stabT: 0.025,
            mAtkT: 0,
            aspdT: 0,
          },
        },
        weaAtk_Matk_Convert: 0.5,
      },
      HALBERD: {
        baseHit: 0.25,
        baseAspd: 20,
        abi_Attr_Convert: {
          str: {
            pAtkT: 2.5,
            stabT: 0.05,
            aspdT: 0.2,
            mAtkT: 0,
          },
          int: {
            mAtkT: 2,
            pAtkT: 0,
            aspdT: 0,
            stabT: 0,
          },
          agi: {
            aspdT: 3.5,
            pAtkT: 1.5,
            mAtkT: 1,
            stabT: 0,
          },
          dex: {
            stabT: 0.05,
            pAtkT: 0,
            mAtkT: 0,
            aspdT: 0,
          },
        },
        weaAtk_Matk_Convert: 0,
      },
      NO_WEAPOEN: {
        baseHit: 50,
        baseAspd: 1000,
        abi_Attr_Convert: {
          str: {
            pAtkT: 1,
            mAtkT: 0,
            aspdT: 0,
            stabT: 0,
          },
          int: {
            mAtkT: 3,
            pAtkT: 0,
            aspdT: 0,
            stabT: 0,
          },
          agi: {
            aspdT: 9.6,
            pAtkT: 0,
            mAtkT: 0,
            stabT: 0,
          },
          dex: {
            pAtkT: 0,
            mAtkT: 0,
            aspdT: 0,
            stabT: 0,
          },
        },
        weaAtk_Matk_Convert: 0,
      },
    };

    public primaryAttributes: {
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
        };
      };
    };
    public systemAttributes: {
      // 系统数值：由系统决定基础值，加成项由基础值决定的
      pPie: modifiers;
      mPie: modifiers;
      pStab: modifiers;
      nDis: modifiers;
      fDis: modifiers;
      crT: modifiers;
      cdT: modifiers;
      weaMatkT: modifiers;
      stro: modifiers;
      total: modifiers;
      final: modifiers;
      am: modifiers;
    };
    public derivedAttributes: {
      // 衍生属性：基础值自由数值决定，玩家只能定义加成项的
      maxHP: modifiers;
      maxMP: modifiers;
      pCr: modifiers;
      pCd: modifiers;
      mainWeaAtk: modifiers;
      subWeaAtk: modifiers;
      totalWeaMatk: modifiers;
      pAtk: modifiers;
      mAtk: modifiers;
      aspd: modifiers;
      cspd: modifiers;
    };
    public actualAttributes: {
      abi: {
        str: number;
        int: number;
        vit: number;
        agi: number;
        dex: number;
        luk: number;
        tec: number;
        cri: number;
        men: number;
      };
      baseAttr: {
        maxHp: number;
        maxMp: number;
        aggro: number;
        range: number;
        mpRegen: number;
        hpRegen: number;
      };
      damageBooster: {
        weaAtk: number;
        katanaAtk: number;
        pAtk: number;
        pPie: number;
        mAtk: number;
        mPie: number;
        pCr: number;
        pCd: number;
        crT: number;
        cdT: number;
        mCr: number;
        mCd: number;
      };
      speedBoster: {
        aspd: number;
        cspd: number;
        am: number;
        cm: number;
      };
    };
    constructor(character: Character) {
      const mainWeaponType = character.equipmentList?.mainWeapon?.mainWeaType ?? "NO_WEAPOEN"
      this.primaryAttributes = {
        lv: character.lv,
        abi: {
          str: {
            baseValue: character.baseAbi?.baseStr ?? 0,
            modifiers: {
              fixed: [],
              percentage: [],
            },
          },
          int: {
            baseValue: character.baseAbi?.baseInt ?? 0,
            modifiers: {
              fixed: [],
              percentage: [],
            },
          },
          vit: {
            baseValue: character.baseAbi?.baseVit ?? 0,
            modifiers: {
              fixed: [],
              percentage: [],
            },
          },
          agi: {
            baseValue: character.baseAbi?.baseAgi ?? 0,
            modifiers: {
              fixed: [],
              percentage: [],
            },
          },
          dex: {
            baseValue: character.baseAbi?.baseDex ?? 0,
            modifiers: {
              fixed: [],
              percentage: [],
            },
          },
          luk: {
            baseValue: character.specialAbi?.specialAbiType === "LUK" ? character.specialAbi.value ?? 0 : 0,
            modifiers: {
              fixed: [],
              percentage: [],
            },
          },
          tec: {
            baseValue: character.specialAbi?.specialAbiType === "TEC" ? character.specialAbi.value ?? 0 : 0,
            modifiers: {
              fixed: [],
              percentage: [],
            },
          },
          men: {
            baseValue: character.specialAbi?.specialAbiType === "MEN" ? character.specialAbi.value ?? 0 : 0,
            modifiers: {
              fixed: [],
              percentage: [],
            },
          },
          cri: {
            baseValue: character.specialAbi?.specialAbiType === "CRI" ? character.specialAbi.value ?? 0 : 0,
            modifiers: {
              fixed: [],
              percentage: [],
            },
          },
        },
        equipment: {
          mainWeapon: {
            type: mainWeaponType,
            baseAtk: {
              baseValue: character.equipmentList?.mainWeapon?.baseAtk ?? 0,
              modifiers: {
                fixed: [],
                percentage: [],
              },
            },
            refinement: character.equipmentList?.mainWeapon?.refinement ?? 0,
            stability: character.equipmentList?.mainWeapon?.stability ?? 0,
          },
          subWeapon: {
            type: character.equipmentList?.subWeapon?.subWeaType ?? "NO_WEAPOEN",
            baseAtk: {
              baseValue: character.equipmentList?.subWeapon?.baseAtk ?? 0,
              modifiers: {
                fixed: [],
                percentage: [],
              },
            },
            refinement: character.equipmentList?.subWeapon?.refinement ?? 0,
            stability: character.equipmentList?.subWeapon?.stability ?? 0,
          },
          BodyArmor: {
            type: character.equipmentList?.bodyArmor?.bodyArmorType ?? "NORMAL",
            baseDef: character.equipmentList?.bodyArmor?.baseDef ?? 0,
            refinement: character.equipmentList?.bodyArmor?.refinement ?? 0,
          },
        },
      };
      this.systemAttributes = {
        pPie: {
          baseValue: 0,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        mPie: {
          baseValue: 0,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        pStab: {
          baseValue: 0,
          modifiers: {
            fixed: [
              {
                value: character.equipmentList?.mainWeapon?.stability ?? 0,
                origin: "mainWeapon.stability",
              },
              {
                value:
                  math.floor(
                    CharacterAttr.weaponAbiT[mainWeaponType]
                      .abi_Attr_Convert.str.stabT *
                      this.totalValue(this.primaryAttributes.abi.str) +
                      CharacterAttr.weaponAbiT[mainWeaponType]
                        .abi_Attr_Convert.int.stabT *
                        this.totalValue(this.primaryAttributes.abi.int) +
                      CharacterAttr.weaponAbiT[mainWeaponType]
                        .abi_Attr_Convert.agi.stabT *
                        this.totalValue(this.primaryAttributes.abi.agi) +
                      CharacterAttr.weaponAbiT[mainWeaponType]
                        .abi_Attr_Convert.dex.stabT *
                        this.totalValue(this.primaryAttributes.abi.dex),
                  ) ?? 0,
                origin: "character.abi",
              },
            ],
            percentage: [],
          },
        },
        nDis: {
          baseValue: 100,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        fDis: {
          baseValue: 100,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        crT: {
          baseValue: 0,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        cdT: {
          baseValue: 50,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        weaMatkT: {
          baseValue:
            CharacterAttr.weaponAbiT[mainWeaponType]
              .weaAtk_Matk_Convert,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        stro: {
          baseValue: 100,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        total: {
          baseValue: 100,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        final: {
          baseValue: 100,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        am: {
          baseValue: 0,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.derivedAttributes = {
        maxHP: {
          baseValue: Math.floor(
            93 + this.primaryAttributes.lv * (127 / 17 + this.totalValue(this.primaryAttributes.abi.vit) / 3),
          ),
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        maxMP: {
          baseValue: Math.floor(
            99 +
              this.primaryAttributes.lv +
              this.totalValue(this.primaryAttributes.abi.int) / 10 +
              this.totalValue(this.primaryAttributes.abi.tec),
          ),
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        pCr: {
          baseValue: 25 + this.totalValue(this.primaryAttributes.abi.cri) / 5,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        pCd: {
          baseValue:
            150 +
            Math.floor(
              Math.max(
                this.totalValue(this.primaryAttributes.abi.str) / 5,
                this.totalValue(this.primaryAttributes.abi.str) + this.totalValue(this.primaryAttributes.abi.agi),
              ) / 10,
            ),
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        mainWeaAtk: {
          baseValue: Math.floor(this.totalValue(this.primaryAttributes.equipment.mainWeapon.baseAtk)),
          modifiers: {
            fixed: [
              {
                value: this.primaryAttributes.equipment.mainWeapon.refinement,
                origin: "mainWeapon.refinement",
              },
            ],
            percentage: [
              {
                value: Math.pow(this.primaryAttributes.equipment.mainWeapon.refinement, 2),
                origin: "mainWeapon.refinement",
              },
            ],
          },
        },
        subWeaAtk: {
          baseValue: this.totalValue(this.primaryAttributes.equipment.subWeapon.baseAtk),
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        totalWeaMatk: {
          baseValue: 0,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        pAtk: {
          baseValue:
            this.primaryAttributes.lv +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.pAtkT *
              this.totalValue(this.primaryAttributes.abi.str) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.pAtkT *
              this.totalValue(this.primaryAttributes.abi.int) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.pAtkT *
              this.totalValue(this.primaryAttributes.abi.agi) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.pAtkT *
              this.totalValue(this.primaryAttributes.abi.dex),
          // 武器攻击力在后续附加
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        mAtk: {
          baseValue:
            this.primaryAttributes.lv +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.mAtkT *
              this.totalValue(this.primaryAttributes.abi.str) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.mAtkT *
              this.totalValue(this.primaryAttributes.abi.int) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.mAtkT *
              this.totalValue(this.primaryAttributes.abi.agi) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.mAtkT *
              this.totalValue(this.primaryAttributes.abi.dex),
          // 武器攻击力在后续附加
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        aspd: {
          baseValue:
            CharacterAttr.weaponAbiT[mainWeaponType].baseAspd +
            this.primaryAttributes.lv +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.aspdT *
              this.totalValue(this.primaryAttributes.abi.str) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.aspdT *
              this.totalValue(this.primaryAttributes.abi.int) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.aspdT *
              this.totalValue(this.primaryAttributes.abi.agi) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.aspdT *
              this.totalValue(this.primaryAttributes.abi.dex),
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
        cspd: {
          baseValue:
            this.totalValue(this.primaryAttributes.abi.dex) * 2.94 +
            this.totalValue(this.primaryAttributes.abi.agi) * 1.16,
          modifiers: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.derivedAttributes.pAtk.baseValue += this.totalValue(this.derivedAttributes.mainWeaAtk);
      // console.log("总武器攻击力：" + this.totalValue(this.derivedAttributes.mainWeaAtk) + ",已附加至攻物攻");
      this.derivedAttributes.mAtk.baseValue +=
        this.totalValue(this.systemAttributes.weaMatkT) * this.totalValue(this.derivedAttributes.mainWeaAtk);
      // console.log(
      //   "总武器攻击力：" +
      //     this.totalValue(this.systemAttributes.weaMatkT) * this.totalValue(this.derivedAttributes.mainWeaAtk) +
      //     ",已附加至魔攻",
      // );

      // 面板属性
      this.actualAttributes = {
        abi: {
          str: this.totalValue(this.primaryAttributes.abi.str),
          int: this.totalValue(this.primaryAttributes.abi.int),
          vit: this.totalValue(this.primaryAttributes.abi.vit),
          agi: this.totalValue(this.primaryAttributes.abi.agi),
          dex: this.totalValue(this.primaryAttributes.abi.dex),
          luk: this.totalValue(this.primaryAttributes.abi.luk),
          tec: this.totalValue(this.primaryAttributes.abi.tec),
          cri: this.totalValue(this.primaryAttributes.abi.cri),
          men: this.totalValue(this.primaryAttributes.abi.men),
        },
        baseAttr: {
          maxHp: this.totalValue(this.derivedAttributes.maxHP),
          maxMp: this.totalValue(this.derivedAttributes.maxMP),
          aggro: 0,
          range: 0,
          mpRegen: 0,
          hpRegen: 0,
        },
        damageBooster: {
          weaAtk: this.totalValue(this.derivedAttributes.mainWeaAtk),
          katanaAtk: 0,
          pAtk: this.totalValue(this.derivedAttributes.pAtk),
          pPie: this.totalValue(this.systemAttributes.pPie),
          mAtk: this.totalValue(this.derivedAttributes.mAtk),
          mPie: this.totalValue(this.systemAttributes.mPie),
          pCr: this.totalValue(this.derivedAttributes.pCr),
          pCd: this.totalValue(this.derivedAttributes.pCd),
          crT: this.totalValue(this.systemAttributes.crT),
          cdT: this.totalValue(this.systemAttributes.cdT),
          mCr: this.totalValue(this.derivedAttributes.pCr) * this.totalValue(this.systemAttributes.crT),
          mCd: (this.totalValue(this.derivedAttributes.pCd) - 100) * this.totalValue(this.systemAttributes.cdT) + 100,
        },
        speedBoster: {
          aspd: this.totalValue(this.derivedAttributes.aspd),
          cspd: this.totalValue(this.derivedAttributes.cspd),
          am: Math.min(
            50,
            this.totalValue(this.systemAttributes.am) +
              Math.max(Math.floor((this.totalValue(this.derivedAttributes.aspd) - 1000) / 180), 0),
          ),
          cm: Math.min(
            100,
            Math.min(
              Math.floor((this.totalValue(this.derivedAttributes.cspd) - 1000) / 180) + 50,
              Math.floor(this.totalValue(this.derivedAttributes.cspd) / 20),
            ),
          ),
        },
      };
    }

    public baseValue = (m: modifiers): number => {
      return m.baseValue;
    };

    public fixedValue = (m: modifiers): number => {
      const fixedArray = m.modifiers.fixed.map((mod) => mod.value);
      return fixedArray.reduce((a, b) => a + b, 0);
    };

    public percentageValue = (m: modifiers): number => {
      const percentageArray = m.modifiers.percentage.map((mod) => mod.value);
      return percentageArray.reduce((a, b) => a + b, 0);
    };

    public totalValue = (m: modifiers): number => {
      const base = this.baseValue(m);
      const fixed = this.fixedValue(m);
      const percentage = this.percentageValue(m);
      return base * (1 + percentage / 100) + fixed;
    };
  }

  class MonsterAttr {
    hp: modifiers;
    pDef: modifiers;
    pRes: modifiers;
    mDef: modifiers;
    mRes: modifiers;
    constructor(monsterState: Monster) {
      this.hp = {
        baseValue: monsterState.maxhp ?? 0,
        modifiers: {
            fixed: [],
            percentage: [],
          },
      };
      this.pDef = {
        baseValue: monsterState.physicalDefense ?? 0,
        modifiers: {
          fixed: [],
          percentage: [],
        },
      };
      this.pRes = {
        baseValue: monsterState.physicalResistance ?? 0,
        modifiers: {
          fixed: [],
          percentage: [],
        },
      };
      this.mDef = {
        baseValue: monsterState.magicalDefense ?? 0,
        modifiers: {
          fixed: [],
          percentage: [],
        },
      };
      this.mRes = {
        baseValue: monsterState.magicalResistance ?? 0,
        modifiers: {
          fixed: [],
          percentage: [],
        },
      };
    }
  }

  // class State {
  //   p: {
  //     maxHp: number;
  //     hp: number;
  //     maxMp: number;
  //     mp: number;
  //     aggro: number;
  //     hpRegen: number;
  //     mpRegen: number;

  //     weaAtk: number;
  //     katanaAtk: number;
  //     pAtk: number;
  //     pPie: number;
  //     mAtk: number;
  //     mPie: number;
  //   };
  //   m: {
  //     maxHp: number;
  //     hp: number;
  //     pDef: number;
  //     pRes: number;
  //     mDef: number;
  //     mRes: number;
  //     cRes: number;
  //     avo: number;
  //     dod: number;
  //     blo: number;
  //     nRatio: number;
  //     pRatio: number;
  //     mRatio: number;
  //   };
  //   constructor(character: Character, monster: Monster) {
  //     this.p = {};
  //     this.m = {};
  //   }
  // }

  interface SkillData {
    index: number;
    name: string;
    aDuration: {
      baseValue: number;
      actualValue: number;
    };
    cDuration: {
      baseValue: number;
      actualValue: number;
    };
    frameDatas: FrameData[];
  }

  interface FrameData {
    frame: number;
    characterAttr: CharacterAttr;
    monsterAttr: MonsterAttr;
  }

  const calculateFrameData = (skillSequence: Skill[], character: Character, monster: Monster) => {
    const skillDatas: SkillData[] = [];
    const characterAttr = new CharacterAttr(character);
    const monsterAttr = new MonsterAttr(monster);
    let skillIndex = 0;

    for (const skill of skillSequence) {
      const frameDatas: FrameData[] = [];
      const computeArg = {
        ...characterAttr,
        ...monsterAttr,
        skillLevel: skill.level,
      };
      // 确定技能效果
      let currentEffect: SkillEffect | null = null;
      for (const effect of skill.skillEffect) {
        if (math.evaluate(effect.condition, { ...computeArg })) {
          currentEffect = effect;
        }
      }
      if (!currentEffect) {
        console.log("技能[" + skill.name + "]没有可发动的效果");
        continue;
      }
      // 计算与帧相关的技能效果参数
      const aDurationBaseValue = currentEffect.actionBaseDuration;
      const aDurationActualValue =
        currentEffect.actionBaseDuration +
        (currentEffect.actionModifiableDuration * (100 - characterAttr.actualAttributes.speedBoster.am)) / 100;
      const cDurationBaseValue = math.evaluate(currentEffect.castingDurationFormula, { ...computeArg }) as number;
      const cDurationActualValue = math.evaluate(currentEffect.castingDurationFormula, { ...computeArg }) as number;
      for (let frame = 0; frame < aDurationActualValue + cDurationActualValue; frame++) {
        // 将当前帧的角色状态数据添加到结果数组中
        frameDatas.push({ frame, characterAttr, monsterAttr });
      }
      skillDatas.push({
        index: skillIndex,
        name: skill.name ?? "null",
        aDuration: {
          baseValue: aDurationBaseValue,
          actualValue: aDurationActualValue,
        },
        cDuration: {
          baseValue: cDurationBaseValue,
          actualValue: cDurationActualValue,
        },
        frameDatas: frameDatas,
      });
      skillIndex++;
    }

    return skillDatas;
  };

  useEffect(() => {
    console.log("--ComboAnalyze Client Render");
    return () => {
      console.log("--ComboAnalyze Client Unmount");
    };
  }, []);

  return (
    <main className="flex flex-col lg:w-[calc(100dvw-96px)] lg:flex-row">
      <div className="Module2 flex flex-1 px-3 backdrop-blur-xl">
        <div className="LeftArea sticky top-0 z-10 flex-1"></div>
        <div className="ModuleContent h-[calc(100dvh-67px)] w-full flex-col overflow-auto lg:h-dvh lg:w-[calc(100dvw-130px)] 2xl:w-[1536px]">
          <div className="Title sticky left-0 mt-3 flex flex-col gap-9 py-5 lg:pt-20">
            <div className="Row flex flex-col items-center justify-between gap-10 lg:flex-row lg:justify-start lg:gap-4">
              <h1 className="Text text-left text-3xl lg:bg-transparent lg:text-4xl">Title</h1>
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
          <div className="Content flex w-fit gap-2 bg-transition-color-8 p-4">
            {calculateFrameData(skillSequence, defaultCharacter, defaultMonster).map((skillData, skillIndex) => (
              <div key={skillData.name + skillIndex} className="frame flex flex-col gap-1">
                <span className="w-full bg-brand-color-1st p-2 text-primary-color">
                  {skillData.name + " : " + skillData.frameDatas.length + " frames"}
                </span>
                <div className="frameData flex">
                  {skillData.frameDatas.map((frameData, frameIndex) => {
                    return (
                      <div
                        key={skillData.name + ".frameData." + frameIndex}
                        className="group relative min-h-6 border-2 border-brand-color-2nd"
                      >
                        <div className="absolute -left-4 bottom-6 z-10 hidden w-[50dvw] flex-col gap-2 rounded bg-primary-color-90 p-4 shadow-2xl shadow-transition-color-20 backdrop-blur-xl group-hover:flex">
                          <span className="Title bg-transition-color-8 p-2">{"Frame : " + frameData.frame}</span>
                          <br />
                          <div className="CharacterAttr flex flex-col gap-1">
                            <span className="Title">CharacterAttr</span>
                            <span className="Content bg-transition-color-8">
                              {JSON.stringify(frameData.characterAttr.actualAttributes, null, 2)}
                            </span>
                          </div>
                          <div className="CharacterAttr flex flex-col gap-1">
                            <span className="Title">MonsterAttr</span>
                            <span className="Content bg-transition-color-8">
                              {JSON.stringify(frameData.monsterAttr, null, 2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="RightArea sticky top-0 z-10 flex-1"></div>
      </div>

      <Dialog state={analyzeDialogState} setState={setAnalyzeDialogState}>
        {
          analyzeDialogState && null
          //   <AnalyzeForm
          //   dictionary={dictionary}
          //   session={session}
          //   setDefaultAnalyzeList={setDefaultAnalyzeList}
          // />
        }
      </Dialog>
    </main>
  );
}
