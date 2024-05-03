"use client";
import React, { useEffect } from "react";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";

import type { abiType, modifiers } from "./analyzeType";
import Dialog from "../_components/dialog";
import { test, useStore } from "~/app/store";
import { type BodyArmorType, type MainWeaType, type SubWeaType } from "@prisma/client";
import type { Character } from "~/server/api/routers/character";
import * as math from "mathjs";
import { type SkillEffect } from "~/server/api/routers/skill";
import { type Monster } from "~/server/api/routers/monster";

export interface Props {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}

interface skillSequenceType {
  id: string;
  state: string;
  skillTreeName: string;
  name: string;
  skillDescription: string;
  level: number;
  weaponElementDependencyType: string;
  element: string;
  skillType: string;
  skillEffect: Omit<SkillEffect, "condition">;
}

export default function AnalyzePageClient(props: Props) {
  const { dictionary } = props;
  const skillSequence: skillSequenceType[] = [
    {
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "CJB",
      skillDescription: "",
      level: 7,
      weaponElementDependencyType: "TRUE",
      element: "NO_ELEMENT",
      skillType: "ACTIVE_SKILL",
      skillEffect: {
        id: "",
        actionBaseDuration: 13,
        actionModifiableDuration: 48,
        belongToskillId: "",
        castingDurationFormula: "max(0,min((2 - (s.lv - 1) * 0.25),(1 - (s.lv - 5) * 0.5)))",
        description: null,
        skillCost: [
          {
            id: "",
            name: "MP Cost",
            costFormula: "p.baseAttr.mp = p.baseAttr.mp - 200",
            skillEffectId: null,
          },
        ],
        skillYield: [
          {
            id: "",
            name: "Damage",
            triggerTimingType: "ON_USE",
            delay: 33,
            yieldFormula: "(C_VMATK + 200) * 500%",
            skillEffectId: null,
            durationType: "SKILL",
            durationValue: 0,
          },
          {
            id: "",
            name: "MP Cost half",
            triggerTimingType: "NEXT_SKILL",
            delay: 0,
            durationType: "UNLIMITED",
            durationValue: 0,
            yieldFormula: "",
            skillEffectId: null,
          },
        ],
      },
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
      skillDescription: "",
      skillEffect: {
        id: "",
        actionBaseDuration: 24,
        actionModifiableDuration: 98,
        belongToskillId: "",
        castingDurationFormula: "0",
        description: null,
        skillCost: [
          {
            id: "",
            name: "MP Cost",
            costFormula: "p.baseAttr.mp = p.baseAttr.mp - 500",
            skillEffectId: null,
          },
        ],
        skillYield: [
          {
            id: "",
            yieldFormula: "",
            name: "Damage",
            triggerTimingType: "ON_USE",
            delay: 30,
            durationType: "SKILL",
            durationValue: 0,
            skillEffectId: null,
          },
        ],
      },
    },
  ];

  // 状态管理参数
  const { analyzeDialogState, setAnalyzeDialogState } = useStore((state) => state.analyzePage);
  const { monster } = useStore((state) => state);

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
    // 最终机体实际数值
    public abi: {
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
    public baseAttr: {
      maxHp: number;
      hp: number;
      maxMp: number;
      mp: number;
      aggro: number;
      totalAggro: number;
      range: number;
      mpRegen: number;
      hpRegen: number;
    };
    public damageBooster: {
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
    public speedBoster: {
      aspd: number;
      cspd: number;
      am: number;
      cm: number;
    };
    constructor(character: Character) {
      const mainWeaponType = character.equipmentList?.mainWeapon?.mainWeaType ?? "NO_WEAPOEN";
      this.primaryAttributes = {
        lv: character.lv,
        abi: {
          str: {
            baseValue: character.baseAbi?.baseStr ?? 0,
            modifiers: {
              static: {
                fixed: [],
                percentage: [],
              },
            },
          },
          int: {
            baseValue: character.baseAbi?.baseInt ?? 0,
            modifiers: {
              static: {
                fixed: [],
                percentage: [],
              },
            },
          },
          vit: {
            baseValue: character.baseAbi?.baseVit ?? 0,
            modifiers: {
              static: {
                fixed: [],
                percentage: [],
              },
            },
          },
          agi: {
            baseValue: character.baseAbi?.baseAgi ?? 0,
            modifiers: {
              static: {
                fixed: [],
                percentage: [],
              },
            },
          },
          dex: {
            baseValue: character.baseAbi?.baseDex ?? 0,
            modifiers: {
              static: {
                fixed: [],
                percentage: [],
              },
            },
          },
          luk: {
            baseValue: character.specialAbi?.specialAbiType === "LUK" ? character.specialAbi.value ?? 0 : 0,
            modifiers: {
              static: {
                fixed: [],
                percentage: [],
              },
            },
          },
          tec: {
            baseValue: character.specialAbi?.specialAbiType === "TEC" ? character.specialAbi.value ?? 0 : 0,
            modifiers: {
              static: {
                fixed: [],
                percentage: [],
              },
            },
          },
          men: {
            baseValue: character.specialAbi?.specialAbiType === "MEN" ? character.specialAbi.value ?? 0 : 0,
            modifiers: {
              static: {
                fixed: [],
                percentage: [],
              },
            },
          },
          cri: {
            baseValue: character.specialAbi?.specialAbiType === "CRI" ? character.specialAbi.value ?? 0 : 0,
            modifiers: {
              static: {
                fixed: [],
                percentage: [],
              },
            },
          },
        },
        equipment: {
          mainWeapon: {
            type: mainWeaponType,
            baseAtk: {
              baseValue: character.equipmentList?.mainWeapon?.baseAtk ?? 0,
              modifiers: {
                static: {
                  fixed: [],
                  percentage: [],
                },
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
                static: {
                  fixed: [],
                  percentage: [],
                },
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
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        mPie: {
          baseValue: 0,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        pStab: {
          baseValue: 0,
          modifiers: {
            static: {
              fixed: [
                {
                  value: character.equipmentList?.mainWeapon?.stability ?? 0,
                  origin: "mainWeapon.stability",
                },
                {
                  value:
                    math.floor(
                      CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.stabT *
                        this.staticTotalValue(this.primaryAttributes.abi.str) +
                        CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.stabT *
                          this.staticTotalValue(this.primaryAttributes.abi.int) +
                        CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.stabT *
                          this.staticTotalValue(this.primaryAttributes.abi.agi) +
                        CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.stabT *
                          this.staticTotalValue(this.primaryAttributes.abi.dex),
                    ) ?? 0,
                  origin: "character.abi",
                },
              ],
              percentage: [],
            },
          },
        },
        nDis: {
          baseValue: 100,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        fDis: {
          baseValue: 100,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        crT: {
          baseValue: 0,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        cdT: {
          baseValue: 50,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        weaMatkT: {
          baseValue: CharacterAttr.weaponAbiT[mainWeaponType].weaAtk_Matk_Convert,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        stro: {
          baseValue: 100,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        total: {
          baseValue: 100,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        final: {
          baseValue: 100,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        am: {
          baseValue: 0,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
      };
      this.derivedAttributes = {
        maxHP: {
          baseValue: Math.floor(
            93 + this.primaryAttributes.lv * (127 / 17 + this.staticTotalValue(this.primaryAttributes.abi.vit) / 3),
          ),
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        maxMP: {
          baseValue: Math.floor(
            99 +
              this.primaryAttributes.lv +
              this.staticTotalValue(this.primaryAttributes.abi.int) / 10 +
              this.staticTotalValue(this.primaryAttributes.abi.tec),
          ),
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        pCr: {
          baseValue: 25 + this.staticTotalValue(this.primaryAttributes.abi.cri) / 5,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        pCd: {
          baseValue:
            150 +
            Math.floor(
              Math.max(
                this.staticTotalValue(this.primaryAttributes.abi.str) / 5,
                this.staticTotalValue(this.primaryAttributes.abi.str) +
                  this.staticTotalValue(this.primaryAttributes.abi.agi),
              ) / 10,
            ),
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        mainWeaAtk: {
          baseValue: Math.floor(this.staticTotalValue(this.primaryAttributes.equipment.mainWeapon.baseAtk)),
          modifiers: {
            static: {
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
        },
        subWeaAtk: {
          baseValue: this.staticTotalValue(this.primaryAttributes.equipment.subWeapon.baseAtk),
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        totalWeaMatk: {
          baseValue: 0,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        pAtk: {
          baseValue:
            this.primaryAttributes.lv +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.pAtkT *
              this.staticTotalValue(this.primaryAttributes.abi.str) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.pAtkT *
              this.staticTotalValue(this.primaryAttributes.abi.int) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.pAtkT *
              this.staticTotalValue(this.primaryAttributes.abi.agi) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.pAtkT *
              this.staticTotalValue(this.primaryAttributes.abi.dex),
          // 武器攻击力在后续附加
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        mAtk: {
          baseValue:
            this.primaryAttributes.lv +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.mAtkT *
              this.staticTotalValue(this.primaryAttributes.abi.str) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.mAtkT *
              this.staticTotalValue(this.primaryAttributes.abi.int) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.mAtkT *
              this.staticTotalValue(this.primaryAttributes.abi.agi) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.mAtkT *
              this.staticTotalValue(this.primaryAttributes.abi.dex),
          // 武器攻击力在后续附加
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        aspd: {
          baseValue:
            CharacterAttr.weaponAbiT[mainWeaponType].baseAspd +
            this.primaryAttributes.lv +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.aspdT *
              this.staticTotalValue(this.primaryAttributes.abi.str) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.aspdT *
              this.staticTotalValue(this.primaryAttributes.abi.int) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.aspdT *
              this.staticTotalValue(this.primaryAttributes.abi.agi) +
            CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.aspdT *
              this.staticTotalValue(this.primaryAttributes.abi.dex),
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
        cspd: {
          baseValue:
            this.staticTotalValue(this.primaryAttributes.abi.dex) * 2.94 +
            this.staticTotalValue(this.primaryAttributes.abi.agi) * 1.16,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
          },
        },
      };
      this.derivedAttributes.pAtk.baseValue += this.staticTotalValue(this.derivedAttributes.mainWeaAtk);
      this.derivedAttributes.mAtk.baseValue +=
        this.staticTotalValue(this.systemAttributes.weaMatkT) *
        this.staticTotalValue(this.derivedAttributes.mainWeaAtk);
      // 添加加成项
      // 被动技能加成
      character.skillList?.skills.forEach((skill) => {
        if (skill.skillType === "PASSIVE_SKILL") {
          skill.skillEffect.forEach((effect) => {
            effect.skillYield.forEach((yielder) => {
              if (yielder.yieldFormula) {
                
              }
            })
          })
        }
      })
      // 主武器加成
      character.equipmentList?.mainWeapon?.modifiersList?.modifiers.forEach((modifier) => {
        if (modifier.modifiersValueType === "PERCENTAGE_BONUS") { }
        else if (modifier.modifiersValueType === "FLAT_BONUS") { }
      })
      // 面板属性
      this.abi = {
        str: this.staticTotalValue(this.primaryAttributes.abi.str),
        int: this.staticTotalValue(this.primaryAttributes.abi.int),
        vit: this.staticTotalValue(this.primaryAttributes.abi.vit),
        agi: this.staticTotalValue(this.primaryAttributes.abi.agi),
        dex: this.staticTotalValue(this.primaryAttributes.abi.dex),
        luk: this.staticTotalValue(this.primaryAttributes.abi.luk),
        tec: this.staticTotalValue(this.primaryAttributes.abi.tec),
        cri: this.staticTotalValue(this.primaryAttributes.abi.cri),
        men: this.staticTotalValue(this.primaryAttributes.abi.men),
      };
      this.baseAttr = {
        maxHp: this.staticTotalValue(this.derivedAttributes.maxHP),
        hp: this.staticTotalValue(this.derivedAttributes.maxHP),
        maxMp: this.staticTotalValue(this.derivedAttributes.maxMP),
        mp: this.staticTotalValue(this.derivedAttributes.maxMP),
        aggro: 0,
        totalAggro: 0,
        range: 0,
        mpRegen: 0,
        hpRegen: 0,
      };
      this.damageBooster = {
        weaAtk: this.staticTotalValue(this.derivedAttributes.mainWeaAtk),
        katanaAtk: 0,
        pAtk: this.staticTotalValue(this.derivedAttributes.pAtk),
        pPie: this.staticTotalValue(this.systemAttributes.pPie),
        mAtk: this.staticTotalValue(this.derivedAttributes.mAtk),
        mPie: this.staticTotalValue(this.systemAttributes.mPie),
        pCr: this.staticTotalValue(this.derivedAttributes.pCr),
        pCd: this.staticTotalValue(this.derivedAttributes.pCd),
        crT: this.staticTotalValue(this.systemAttributes.crT),
        cdT: this.staticTotalValue(this.systemAttributes.cdT),
        mCr: this.staticTotalValue(this.derivedAttributes.pCr) * this.staticTotalValue(this.systemAttributes.crT),
        mCd:
          (this.staticTotalValue(this.derivedAttributes.pCd) - 100) * this.staticTotalValue(this.systemAttributes.cdT) +
          100,
      };
      this.speedBoster = {
        aspd: this.staticTotalValue(this.derivedAttributes.aspd),
        cspd: this.staticTotalValue(this.derivedAttributes.cspd),
        am: Math.min(
          50,
          this.staticTotalValue(this.systemAttributes.am) +
            Math.max(Math.floor((this.staticTotalValue(this.derivedAttributes.aspd) - 1000) / 180), 0),
        ),
        cm: Math.min(
          100,
          Math.min(
            Math.floor((this.staticTotalValue(this.derivedAttributes.cspd) - 1000) / 180) + 50,
            Math.floor(this.staticTotalValue(this.derivedAttributes.cspd) / 20),
          ),
        ),
      };
    }

    public baseValue = (m: modifiers): number => {
      return m.baseValue;
    };

    public staticFixedValue = (m: modifiers): number => {
      const fixedArray = m.modifiers.static.fixed.map((mod) => mod.value);
      return fixedArray.reduce((a, b) => a + b, 0);
    };

    public dynamicFixedValue = (m: modifiers): number => {
      let value = 0;
      if (m.modifiers.dynamic?.fixed) {
        const fixedArray = m.modifiers.dynamic.fixed.map((mod) => mod.value);
        value = fixedArray.reduce((a, b) => a + b, 0) + this.staticFixedValue(m);
      }
      return value;
    };

    public staticPercentageValue = (m: modifiers): number => {
      const percentageArray = m.modifiers.static.percentage.map((mod) => mod.value);
      return percentageArray.reduce((a, b) => a + b, 0);
    };

    public dynamicPercentageValue = (m: modifiers): number => {
      let value = 0;
      if (m.modifiers.dynamic?.percentage) {
        const percentageArray = m.modifiers.dynamic.percentage.map((mod) => mod.value);
        value = percentageArray.reduce((a, b) => a + b, 0) + this.staticPercentageValue(m);
      }
      return value;
    };

    public staticTotalValue = (m: modifiers): number => {
      const base = this.baseValue(m);
      const fixed = this.staticFixedValue(m);
      const percentage = this.staticPercentageValue(m);
      return base * (1 + percentage / 100) + fixed;
    };

    public dynamicTotalValue = (m: modifiers): number => {
      const base = this.baseValue(m);
      const fixed = this.dynamicFixedValue(m);
      const percentage = this.dynamicPercentageValue(m);
      return base * (1 + percentage / 100) + fixed;
    };
  }

  class MonsterAttr {
    attr: {
      hp: modifiers;
      pDef: modifiers;
      pRes: modifiers;
      mDef: modifiers;
      mRes: modifiers;
    };
    hp: number;
    pDef: number;
    pRes: number;
    mDef: number;
    mRes: number;
    constructor(monsterState: Monster) {
      this.attr = {
        hp : {
        baseValue: monsterState.maxhp ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
        },
      },
      pDef : {
        baseValue: monsterState.physicalDefense ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
        },
      },
      pRes : {
        baseValue: monsterState.physicalResistance ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
        },
        },
        mDef : {
        baseValue: monsterState.magicalDefense ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
        },
        },
        mRes : {
        baseValue: monsterState.magicalResistance ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
        },
      },
      }
      
      this.hp = this.dynamicTotalValue(this.attr.hp);
      this.pDef = this.dynamicTotalValue(this.attr.pDef);
      this.pRes = this.dynamicTotalValue(this.attr.pRes);
      this.mDef = this.dynamicTotalValue(this.attr.mDef);
      this.mRes = this.dynamicTotalValue(this.attr.mRes);
    }

    public baseValue = (m: modifiers): number => {
      return m.baseValue;
    };

    public staticFixedValue = (m: modifiers): number => {
      const fixedArray = m.modifiers.static.fixed.map((mod) => mod.value);
      return fixedArray.reduce((a, b) => a + b, 0);
    };

    public dynamicFixedValue = (m: modifiers): number => {
      let value = 0;
      if (m.modifiers.dynamic?.fixed) {
        const fixedArray = m.modifiers.dynamic.fixed.map((mod) => mod.value);
        value = fixedArray.reduce((a, b) => a + b, 0) + this.staticFixedValue(m);
      }
      return value;
    };

    public staticPercentageValue = (m: modifiers): number => {
      const percentageArray = m.modifiers.static.percentage.map((mod) => mod.value);
      return percentageArray.reduce((a, b) => a + b, 0);
    };

    public dynamicPercentageValue = (m: modifiers): number => {
      let value = 0;
      if (m.modifiers.dynamic?.percentage) {
        const percentageArray = m.modifiers.dynamic.percentage.map((mod) => mod.value);
        value = percentageArray.reduce((a, b) => a + b, 0) + this.staticPercentageValue(m);
      }
      return value;
    };

    public staticTotalValue = (m: modifiers): number => {
      const base = this.baseValue(m);
      const fixed = this.staticFixedValue(m);
      const percentage = this.staticPercentageValue(m);
      return base * (1 + percentage / 100) + fixed;
    };

    public dynamicTotalValue = (m: modifiers): number => {
      const base = this.baseValue(m);
      const fixed = this.dynamicFixedValue(m);
      const percentage = this.dynamicPercentageValue(m);
      return base * (1 + percentage / 100) + fixed;
    };
  }

  interface FrameData {
    skillAttr: {
      currentSkillName: string;
      remainingFramesOfTheSkill: number;
    };
    characterAttr: CharacterAttr;
    monsterAttr: MonsterAttr;
  }

  interface eventSequenceType {
    frame: number;
    event: () => void;
    origin: string;
  }

  const calculateFrameData = (skillSequence: skillSequenceType[], character: Character, monster: Monster) => {
    const frameDatas: FrameData[] = [];
    let skillIndex = 0;
    let remainingFramesOfTheSkill = 1;
    let eventSequence: eventSequenceType[] = [];
    const characterAttr = new CharacterAttr(character);
    const monsterAttr = new MonsterAttr(monster);
    // 设置上限20分钟 = 60 * 60 * 20
    for (let frame = 0; frame < 72000; frame++) {
      remainingFramesOfTheSkill--;
      monsterAttr.attr.hp.modifiers.static.fixed.push({
        value: -100000,
        origin: "系统自动减损"
      })
      // 检查是否存在死亡
      if (characterAttr.baseAttr.hp <= 0) {
        console.log("角色死亡");
        break;
      }
      if (monsterAttr.hp <= 0) {
        console.log("怪物死亡");
        break;
      }
      // 技能计算
      if (skillIndex >= skillSequence.length) {
        console.log("技能序列执行完毕");
        break;
      }
      const currentSkill = skillSequence[skillIndex]!;
      console.log("当前技能：" + currentSkill.name);
      const computeArg = {
        p: {
          ...characterAttr,
        },
        m: {
          ...monsterAttr,
        },
        s: {
          lv: currentSkill.level,
        },
      };

      // 当前技能执行完毕时，计算下一个技能动作总帧数
      if (remainingFramesOfTheSkill === 0) {
        if (frame > 0) {
          skillIndex++;
        }
        const nextSkill = skillSequence[skillIndex];
        if (!nextSkill) {
          console.log("末端技能为："+ currentSkill.name +"。技能序列执行完毕");
          break;
        }
        // 计算与帧相关的技能效果参数
        // 固定动画时长
        const aDurationBaseValue = nextSkill.skillEffect.actionBaseDuration;
        // 可加速动画时长
        const aDurationActualValue =
          nextSkill.skillEffect.actionBaseDuration +
          (nextSkill.skillEffect.actionModifiableDuration * (100 - characterAttr.speedBoster.am)) / 100;
        // 固定咏唱时长
        const cDurationBaseValue = math.evaluate(nextSkill.skillEffect.castingDurationFormula, {
          ...computeArg,
        }) as number;
        // 可加速咏唱时长
        const cDurationActualValue = math.evaluate(nextSkill.skillEffect.castingDurationFormula, {
          ...computeArg,
        }) as number;
        remainingFramesOfTheSkill =
          aDurationBaseValue + aDurationActualValue + cDurationBaseValue + cDurationActualValue;
      }

      // 定义新序列防止删除元素时索引发生混乱
      const newEventSequence: eventSequenceType[] = [];
      eventSequence.forEach((event) => {
        event.frame -= 1;
        // 执行当前帧需要做的事
        if (event.frame === 0) {
          event.event();
        }
        // 将未来需要做的事放在新序列中
        if (event.frame > 0) {
          newEventSequence.push(event);
        }
      });
      // 将新序列赋值
      eventSequence = newEventSequence;

      frameDatas.push({
        skillAttr: {
          currentSkillName: currentSkill.name,
          remainingFramesOfTheSkill: remainingFramesOfTheSkill
        },
        characterAttr: characterAttr,
        monsterAttr: monsterAttr,
      });
    }
    return frameDatas;
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
        <div className={`ModuleContent h-[calc(100dvh-67px)] w-full flex-col overflow-auto lg:h-dvh lg:max-w-[1536px]`}>
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
          <div className="Content flex w-fit bg-transition-color-8 p-4">
            {calculateFrameData(skillSequence, test.character, test.monster).map((frameData, frameIndex) => (
              <div key={frameIndex} className="frame flex flex-col gap-1">
                <div className="frameData flex">
                  <div
                    className="group relative min-h-6 border-2 border-brand-color-2nd"
                  >
                    <div className="absolute -left-4 bottom-6 z-10 hidden w-[50dvw] flex-col gap-2 rounded bg-primary-color-90 p-4 shadow-2xl shadow-transition-color-20 backdrop-blur-xl group-hover:flex">
                      <span className="Title bg-transition-color-8 p-2">{"Frame : " + frameIndex}</span>
                      <br />
                      <div className="SkillAttr flex flex-col gap-1">
                        <span className="Title">Skill</span>
                        <span className="Content bg-transition-color-8">
                          {JSON.stringify(frameData.skillAttr, null, 2)}
                        </span>
                      </div>
                      <div className="CharacterAttr flex flex-col gap-1">
                        <span className="Title">CharacterAttr</span>
                        <span className="Content bg-transition-color-8">
                          {JSON.stringify(frameData.characterAttr.baseAttr, null, 2)}
                          {JSON.stringify(frameData.characterAttr.speedBoster, null, 2)}
                        </span>
                      </div>
                      <div className="CharacterAttr flex flex-col gap-1">
                        <span className="Title">MonsterAttr</span>
                        <span className="Content bg-transition-color-8">
                          {JSON.stringify(frameData.monsterAttr.hp, null, 2)}
                        </span>
                      </div>
                    </div>
                  </div>
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
