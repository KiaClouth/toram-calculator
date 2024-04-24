"use client";
import React, { useEffect } from "react";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";

import type { _Character, _Skill, abiType, CharacterState, FrameData, modifiers } from "./analyzeType";
import Dialog from "../_components/dialog";
import { useBearStore } from "~/app/store";
import { BodyArmorType, MainWeaType, SubWeaType } from "@prisma/client";

export interface Props {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}

export default function AnalyzePageClient(props: Props) {
  const { dictionary } = props;
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
              costFormula: "200",
              skillEffectId: null,
            },
          ],
          yield: [
            {
              id: "",
              triggerTiming: "ON_USE",
              delay: 33,
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
              yieldFormula: "",
              skillEffectId: null,
            },
          ],
          id: "",
          actionBaseDuration: 13,
          actionModifiableDuration: 48,
          belongToskillId: "",
          castingDurationFormula: "",
          description: null,
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
      skillEffect: [
        {
          condition: "",
          cost: [
            {
              costFormula: "",
              id: "",
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
              skillEffectId: null,
            },
          ],
          id: "",
          actionBaseDuration: 24,
          actionModifiableDuration: 98,
          belongToskillId: "",
          castingDurationFormula: "",
          description: null,
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
      skillDescription: null,
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
        };
      };
    };
    systemAttributes: {
      // 系统数值：由系统决定基础值，加成项由基础值决定的
      pPie: modifiers;
      mPie: modifiers;
      pStab: modifiers;
      mStab: modifiers;
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
    derivedAttributes: {
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
    constructor(state: CharacterState) {
      this.primaryAttributes = state.primaryAttributes;
      this.systemAttributes = {
        pPie: {
          baseValue: 0,
          modifiers: state.systemAttributes.pPie.modifiers,
        },
        mPie: {
          baseValue: 0,
          modifiers: state.systemAttributes.mPie.modifiers,
        },
        pStab: {
          baseValue: 0,
          modifiers: state.systemAttributes.pStab.modifiers.concat(
            {
              valueType: "fixed",
              value: state.primaryAttributes.equipment.mainWeapon.stability,
              origin: "mainWeapon",
            },
            {
              valueType: "fixed",
              value: Math.min(
                100,
                Math.floor(
                  CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.str.stabT *
                    this.totalValue(this.primaryAttributes.abi.str) +
                    CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.int.stabT *
                      this.totalValue(this.primaryAttributes.abi.int) +
                    CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.agi.stabT *
                      this.totalValue(this.primaryAttributes.abi.agi) +
                    CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.dex.stabT *
                      this.totalValue(this.primaryAttributes.abi.dex),
                ),
              ),
              origin: "abi",
            },
          ),
        },
        mStab: {
          baseValue: 0,
          modifiers: state.systemAttributes.pStab.modifiers.concat({
            valueType: "fixed",
            value: Math.floor(
              Math.min(
                100,
                Math.floor(
                  state.primaryAttributes.equipment.mainWeapon.stability +
                    CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.str.stabT *
                      this.totalValue(this.primaryAttributes.abi.str) +
                    CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.int.stabT *
                      this.totalValue(this.primaryAttributes.abi.int) +
                    CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.agi.stabT *
                      this.totalValue(this.primaryAttributes.abi.agi) +
                    CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.dex.stabT *
                      this.totalValue(this.primaryAttributes.abi.dex),
                ),
              ) /
                2 +
                50,
            ),
            origin: "pStab",
          }),
        },
        nDis: {
          baseValue: 100,
          modifiers: state.systemAttributes.nDis.modifiers,
        },
        fDis: {
          baseValue: 100,
          modifiers: state.systemAttributes.fDis.modifiers,
        },
        crT: {
          baseValue: 0,
          modifiers: state.systemAttributes.crT.modifiers,
        },
        cdT: {
          baseValue: 50,
          modifiers: state.systemAttributes.cdT.modifiers,
        },
        weaMatkT: {
          baseValue: CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].weaAtk_Matk_Convert,
          modifiers: [],
        },
        stro: {
          baseValue: 100,
          modifiers: state.systemAttributes.stro.modifiers,
        },
        total: {
          baseValue: 100,
          modifiers: state.systemAttributes.total.modifiers,
        },
        final: {
          baseValue: 100,
          modifiers: state.systemAttributes.final.modifiers,
        },
        am: {
          baseValue: 0,
          modifiers: state.systemAttributes.am.modifiers,
        },
      };
      this.derivedAttributes = {
        maxHP: {
          baseValue: Math.floor(
            93 + this.primaryAttributes.lv * (127 / 17 + this.totalValue(this.primaryAttributes.abi.vit) / 3),
          ),
          modifiers: state.derivedAttributes.maxHP.modifiers,
        },
        maxMP: {
          baseValue: Math.floor(
            99 +
              this.primaryAttributes.lv +
              this.totalValue(this.primaryAttributes.abi.int) / 10 +
              this.totalValue(this.primaryAttributes.abi.tec),
          ),
          modifiers: state.derivedAttributes.maxMP.modifiers,
        },
        pCr: {
          baseValue: 25 + this.totalValue(this.primaryAttributes.abi.cri) / 5,
          modifiers: state.derivedAttributes.pCr.modifiers,
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
          modifiers: state.derivedAttributes.pCd.modifiers,
        },
        mainWeaAtk: {
          baseValue: Math.floor(this.totalValue(this.primaryAttributes.equipment.mainWeapon.baseAtk)),
          modifiers: state.derivedAttributes.mainWeaAtk.modifiers.concat(
            {
              valueType: "percentage",
              value: Math.pow(this.primaryAttributes.equipment.mainWeapon.refinement, 2),
              origin: "mainWeapon.refinement",
            },
            {
              valueType: "fixed",
              value: this.primaryAttributes.equipment.mainWeapon.refinement,
              origin: "mainWeapon.refinement",
            },
          ),
        },
        subWeaAtk: {
          baseValue: this.totalValue(this.primaryAttributes.equipment.subWeapon.baseAtk),
          modifiers: [],
        },
        totalWeaMatk: {
          baseValue: 0,
          modifiers: [],
        },
        pAtk: {
          baseValue:
            this.primaryAttributes.lv +
            CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.str.pAtkT *
              this.totalValue(this.primaryAttributes.abi.str) +
            CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.int.pAtkT *
              this.totalValue(this.primaryAttributes.abi.int) +
            CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.agi.pAtkT *
              this.totalValue(this.primaryAttributes.abi.agi) +
            CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.dex.pAtkT *
              this.totalValue(this.primaryAttributes.abi.dex),
          // 武器攻击力在后续附加
          modifiers: state.derivedAttributes.pAtk.modifiers,
        },
        mAtk: {
          baseValue:
            this.primaryAttributes.lv +
            CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.str.mAtkT *
              this.totalValue(this.primaryAttributes.abi.str) +
            CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.int.mAtkT *
              this.totalValue(this.primaryAttributes.abi.int) +
            CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.agi.mAtkT *
              this.totalValue(this.primaryAttributes.abi.agi) +
            CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.dex.mAtkT *
              this.totalValue(this.primaryAttributes.abi.dex),
          // 武器攻击力在后续附加
          modifiers: state.derivedAttributes.mAtk.modifiers,
        },
        aspd: {
          baseValue:
            CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].baseAspd +
            this.primaryAttributes.lv +
            CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.str.aspdT *
              this.totalValue(this.primaryAttributes.abi.str) +
            CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.int.aspdT *
              this.totalValue(this.primaryAttributes.abi.int) +
            CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.agi.aspdT *
              this.totalValue(this.primaryAttributes.abi.agi) +
            CharacterAttr.weaponAbiT[state.primaryAttributes.equipment.mainWeapon.type].abi_Attr_Convert.dex.aspdT *
              this.totalValue(this.primaryAttributes.abi.dex),
          modifiers: state.derivedAttributes.aspd.modifiers,
        },
        cspd: {
          baseValue:
            this.totalValue(state.primaryAttributes.abi.dex) * 2.94 +
            this.totalValue(state.primaryAttributes.abi.agi) * 1.16,
          modifiers: state.derivedAttributes.cspd.modifiers,
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
    }

    public baseValue = (m: modifiers): number => {
      return m.baseValue;
    };

    public fixedValue = (m: modifiers): number => {
      const fixedArray = m.modifiers.filter((mod) => mod.valueType === "fixed").map((mod) => mod.value);
      return fixedArray.reduce((a, b) => a + b, 0);
    };

    public percentageValue = (m: modifiers): number => {
      const percentageArray = m.modifiers.filter((mod) => mod.valueType === "percentage").map((mod) => mod.value);
      return percentageArray.reduce((a, b) => a + b, 0);
    };

    public totalValue = (m: modifiers): number => {
      const base = this.baseValue(m);
      const fixed = this.fixedValue(m);
      const percentage = this.percentageValue(m);
      return base * (1 + percentage / 100) + fixed;
    };
  }

  const initialCharacterState = new CharacterAttr({
    systemAttributes: {
      pPie: {
        modifiers: [],
      },
      mPie: {
        modifiers: [
          {
            valueType: "fixed",
            value: 20,
            origin: "mainWeapon.Crystal",
          },
          {
            valueType: "fixed",
            value: 10,
            origin: "bodyArmor.Crystal",
          },
          {
            valueType: "fixed",
            value: 25,
            origin: "additionalEquipment.饼干腰翼",
          },
          {
            valueType: "fixed",
            value: 10,
            origin: "additionalEquipment.饼干腰翼.Crystal",
          },
          {
            valueType: "fixed",
            value: 10,
            origin: "specialEquipment.读星提灯",
          },
          {
            valueType: "fixed",
            value: 23,
            origin: "fashion",
          },
        ],
      },
      pStab: {
        modifiers: [],
      },
      mStab: {
        modifiers: [
          {
            valueType: "fixed",
            value: 20,
            origin: "skill",
          },
        ],
      },
      nDis: {
        modifiers: [
          {
            valueType: "fixed",
            value: 2,
            origin: "fashion",
          },
          {
            valueType: "fixed",
            value: 8,
            origin: "additionalEquipment.饼干腰翼.Crystal",
          },
        ],
      },
      fDis: {
        modifiers: [
          {
            valueType: "fixed",
            value: 8,
            origin: "additionalEquipment.饼干腰翼.Crystal",
          },
        ],
      },
      crT: {
        modifiers: [
          {
            valueType: "fixed",
            value: 25,
            origin: "skill",
          },
        ],
      },
      cdT: {
        modifiers: [
          {
            valueType: "fixed",
            value: 25,
            origin: "skill",
          },
        ],
      },
      stro: {
        modifiers: [
          {
            valueType: "fixed",
            value: 22,
            origin: "mainWeapon",
          },
          {
            valueType: "fixed",
            value: 22,
            origin: "bodyArmor",
          },
        ],
      },
      total: {
        modifiers: [
          {
            valueType: "fixed",
            value: 10,
            origin: "skill",
          },
        ],
      },
      final: {
        modifiers: [],
      },
      am: {
        modifiers: [
          {
            valueType: "fixed",
            value: 3,
            origin: "mainWeapon.Crystal",
          },
          {
            valueType: "fixed",
            value: 2,
            origin: "specialEquipment.读星提灯.Crystal",
          },
          {
            valueType: "fixed",
            value: 30,
            origin: "skill",
          },
        ],
      },
    },
    primaryAttributes: {
      lv: 265,
      abi: {
        str: {
          baseValue: 0,
          modifiers: [],
        },
        int: {
          baseValue: 430,
          modifiers: [
            {
              valueType: "percentage",
              value: 10,
              origin: "mainWeapon",
            }, {
              valueType: "percentage",
              value: 7,
              origin: "bodyArmor",
            }, {
              valueType: "percentage",
              value: 3,
              origin: "bodyArmor.Crystal",
            }, {
              valueType: "fixed",
              value: 18,
              origin: "ll",
            },
          ],
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
          baseValue: 247,
          modifiers: [{
            valueType: "percentage",
            value: 5,
            origin: "additionalEquipment.饼干腰翼",
          }, {
            valueType: "fixed",
            value: 30,
            origin: "ll",
          }],
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
          type: "MAGIC_DEVICE",
          baseAtk: {
            baseValue: 343,
            modifiers: [],
          },
          refinement: 15,
          stability: 60,
        },
        subWeapon: {
          type: "NINJUTSUSCROLL",
          baseAtk: {
            baseValue: 0,
            modifiers: [],
          },
          refinement: 0,
          stability: 0,
        },
        BodyArmor: {
          type: "LIGHT",
          baseDef: 10,
          refinement: 7,
        },
      },
    },
    derivedAttributes: {
      maxHP: {
        modifiers: [],
      },
      maxMP: {
        modifiers: [{
          valueType: "fixed",
          value: 1000,
          origin: "ll",
        }, {
          valueType: "fixed",
          value: 50,
          origin: "skill",
          }, {
            valueType: "fixed",
            value: -150,
            origin: "bodyArmor.Crystal",
          }, {
            valueType: "fixed",
            value: -150,
            origin: "additionalEquipment.饼干腰翼.Crystal",
          }, {
            valueType: "fixed",
            value: 300,
            origin: "specialEquipment.读星提灯.Crystal",
          }, {
            valueType: "fixed",
            value: 100,
            origin: "th",
          }, {
            valueType: "fixed",
            value: 100,
            origin: "工会加成",
          },
          {
            valueType: "fixed",
            value: 100,
            origin: "会员",
        }],
      },
      pCr: {
        modifiers: [],
      },
      pCd: {
        modifiers: [],
      },
      mainWeaAtk: {
        modifiers: [{
          valueType: "percentage",
          value: 60,
          origin: "mainWeapon",
        }],
      },
      subWeaAtk: {
        modifiers: [],
      },
      totalWeaMatk: {
        modifiers: [],
      },
      pAtk: {
        modifiers: [],
      },
      mAtk: {
        modifiers: [
          {
            valueType: "percentage",
            value: 12,
            origin: "mainWeapon",
          },
        ],
      },
      aspd: {
        modifiers: [],
      },
      cspd: {
        modifiers: [],
      },
    },
  });

  console.log(initialCharacterState.totalValue(initialCharacterState.derivedAttributes.mainWeaAtk));

  function calculateFrameData(skillSequence: _Skill[], initialCharacterState: CharacterState): FrameData[] {
    const frameData: FrameData[] = [];
    const characterState = initialCharacterState;

    for (let frame = 0; frame < 1; frame++) {
      // 应用技能效果到角色状态上
      // 这里需要根据技能属性和当前角色状态来计算新的角色状态
      // 例如：characterState = applySkillEffect(characterState, skillSequence[frame]);

      // 将当前帧的角色状态数据添加到结果数组中
      frameData.push({ frame, characterState });
    }

    return frameData;
  }

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
          {calculateFrameData(skillSequence, initialCharacterState).map((frameData) => (
            <div key={frameData.frame} className="frame flex flex-col">
              <span>{frameData.frame}</span>
              <div>
                {Object.entries(frameData.characterState.primaryAttributes).map(([key, value0]) => (
                  <p key={"primaryAttributes" + key + frameData.frame}>
                    {key}: {JSON.stringify(value0, null, 2)}
                    {/* {typeof value0 == "object"
                      ? Object.entries(value0 as unknown as Record<string, unknown>).map(([key1, value1]) => (
                          <p key={key1 + frameData.frame}>
                            {"--" + key1}: {JSON.stringify(value1)}
                          </p>
                        ))
                      : value0} */}
                    <br />
                    {"\n ----------------------------------------------------- \n"}
                  </p>
                ))}

                {Object.entries(frameData.characterState.systemAttributes).map(([key, value0]) => (
                  <p key={"systemAttributes" + key + frameData.frame}>
                    {key}: {JSON.stringify(value0, null, 2)}
                    {/* {typeof value0 == "object"
                      ? Object.entries(value0 as unknown as Record<string, unknown>).map(([key1, value1]) => (
                          <p key={key1 + frameData.frame}>
                            {"--" + key1}: {JSON.stringify(value1)}
                          </p>
                        ))
                      : value0} */}
                    <br />
                    {"\n ----------------------------------------------------- \n"}
                  </p>
                ))}

                {Object.entries(frameData.characterState.derivedAttributes).map(([key, value0]) => (
                  <p key={"derivedAttributes" + key + frameData.frame}>
                    {key}: {JSON.stringify(value0, null, 2)}
                    {/* {typeof value0 == "object"
                      ? Object.entries(value0 as unknown as Record<string, unknown>).map(([key1, value1]) => (
                          <p key={key1 + frameData.frame}>
                            {"--" + key1}: {JSON.stringify(value1)}
                          </p>
                        ))
                      : value0} */}
                    <br />
                    {"\n ----------------------------------------------------- \n"}
                  </p>
                ))}
              </div>
            </div>
          ))}
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
