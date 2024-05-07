"use client";
import React, { useEffect } from "react";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";

import type { modifiers } from "./analyzeType";
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
        description: null,
        actionBaseDurationFormula: "13",
        actionModifiableDurationFormula: "48",
        castingBaseDurationFormula: "0",
        castingModifiableDurationFormula: "max(0,min((2 - (s.lv - 1) * 0.25),(1 - (s.lv - 5) * 0.5)))",
        skillWindUpFormula: "0",
        skillRecoveryFormula: "0",
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
            yieldFormula: "(C_VMATK + 200) * 500%",
            mutationTimingFormula: null,
            skillEffectId: null,
          },
          {
            id: "",
            name: "MP Cost half",
            yieldType: "PersistentEffect",
            yieldFormula: "",
            skillEffectId: null,
            mutationTimingFormula: "",
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
        actionBaseDurationFormula: "24",
        actionModifiableDurationFormula: "98",
        castingBaseDurationFormula: "0",
        castingModifiableDurationFormula: "8",
        skillWindUpFormula: "0",
        skillRecoveryFormula: "0",
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
            yieldFormula: "",
            name: "Damage",
            skillEffectId: null,
            yieldType: "ImmediateEffect",
            mutationTimingFormula: null,
          },
        ],
      },
    },
  ];

  // 状态管理参数
  const { analyzeDialogState, setAnalyzeDialogState } = useStore((state) => state.analyzePage);
  // const { monster } = useStore((state) => state);

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

    // 自由数值：玩家可定义基础值和加成项的，不由其他数值转化而来，但是会参与衍生属性计算的数值
    lv: number;
    str: modifiers;
    int: modifiers;
    vit: modifiers;
    agi: modifiers;
    dex: modifiers;
    luk: modifiers;
    cri: modifiers;
    tec: modifiers;
    men: modifiers;
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
      baseDef: modifiers;
      refinement: number;
    };
    // 系统数值：由系统决定基础值，加成项由自由数值决定的
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
    cm: modifiers;
    // 衍生属性：基础值由自由数值决定，玩家只能定义加成项的
    maxHP: modifiers;
    maxMP: modifiers;
    pCr: modifiers;
    pCd: modifiers;
    mainWeaAtk: modifiers;
    subWeaAtk: modifiers;
    totalWeaAtk: modifiers;
    pAtk: modifiers;
    mAtk: modifiers;
    unsheatheAtk: modifiers;
    aspd: modifiers;
    cspd: modifiers;
    // 再衍生属性
    hp: modifiers;
    mp: modifiers;
    ampr: modifiers;
    aggro: modifiers;

    constructor(character: Character) {
      const mainWeaponType = character.equipmentList?.mainWeapon?.mainWeaType ?? "NO_WEAPOEN";
      const subWeaponType = character.equipmentList?.subWeapon?.subWeaType ?? "NO_WEAPOEN";
      const bodyArmorType = character.equipmentList?.bodyArmor?.bodyArmorType ?? "NORMAL";
      // 计算基础值

      this.lv = character.lv;
      this.str = {
        baseValue: character.baseAbi?.baseStr ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.int = {
        baseValue: character.baseAbi?.baseInt ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.vit = {
        baseValue: character.baseAbi?.baseVit ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.agi = {
        baseValue: character.baseAbi?.baseAgi ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.dex = {
        baseValue: character.baseAbi?.baseDex ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.luk = {
        baseValue: character.specialAbi?.specialAbiType === "LUK" ? character.specialAbi.value ?? 0 : 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.tec = {
        baseValue: character.specialAbi?.specialAbiType === "TEC" ? character.specialAbi.value ?? 0 : 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.men = {
        baseValue: character.specialAbi?.specialAbiType === "MEN" ? character.specialAbi.value ?? 0 : 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.cri = {
        baseValue: character.specialAbi?.specialAbiType === "CRI" ? character.specialAbi.value ?? 0 : 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.mainWeapon = {
        type: mainWeaponType,
        baseAtk: {
          baseValue: character.equipmentList?.mainWeapon?.baseAtk ?? 0,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
            dynamic: {
              fixed: [],
              percentage: [],
            },
          },
        },
        refinement: character.equipmentList?.mainWeapon?.refinement ?? 0,
        stability: character.equipmentList?.mainWeapon?.stability ?? 0,
      };
      this.subWeapon = {
        type: subWeaponType,
        baseAtk: {
          baseValue: character.equipmentList?.subWeapon?.baseAtk ?? 0,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
            dynamic: {
              fixed: [],
              percentage: [],
            },
          },
        },
        refinement: character.equipmentList?.subWeapon?.refinement ?? 0,
        stability: character.equipmentList?.subWeapon?.stability ?? 0,
      };
      this.BodyArmor = {
        type: bodyArmorType,
        baseDef: {
          baseValue: character.equipmentList?.bodyArmor?.baseDef ?? 0,
          modifiers: {
            static: {
              fixed: [],
              percentage: [],
            },
            dynamic: {
              fixed: [],
              percentage: [],
            },
          },
        },
        refinement: character.equipmentList?.bodyArmor?.refinement ?? 0,
      };

      this.pPie = {
        baseValue: 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.mPie = {
        baseValue: 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.pStab = {
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
                      this.staticTotalValue(this.str) +
                      CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.stabT *
                        this.staticTotalValue(this.int) +
                      CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.stabT *
                        this.staticTotalValue(this.agi) +
                      CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.stabT *
                        this.staticTotalValue(this.dex),
                  ) ?? 0,
                origin: "character.abi",
              },
            ],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.nDis = {
        baseValue: 100,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.fDis = {
        baseValue: 100,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.crT = {
        baseValue: 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.cdT = {
        baseValue: 50,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.weaMatkT = {
        baseValue: CharacterAttr.weaponAbiT[mainWeaponType].weaAtk_Matk_Convert,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.stro = {
        baseValue: 100,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.total = {
        baseValue: 100,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.final = {
        baseValue: 100,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.am = {
        baseValue: 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.cm = {
        baseValue: 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };

      this.maxHP = {
        baseValue: Math.floor(93 + this.lv * (127 / 17 + this.staticTotalValue(this.vit) / 3)),
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.maxMP = {
        baseValue: Math.floor(99 + this.lv + this.staticTotalValue(this.int) / 10 + this.staticTotalValue(this.tec)),
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.pCr = {
        baseValue: 25 + this.staticTotalValue(this.cri) / 5,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.pCd = {
        baseValue:
          150 +
          Math.floor(
            Math.max(
              this.staticTotalValue(this.str) / 5,
              this.staticTotalValue(this.str) + this.staticTotalValue(this.agi),
            ) / 10,
          ),
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.mainWeaAtk = {
        baseValue: Math.floor(this.staticTotalValue(this.mainWeapon.baseAtk)),
        modifiers: {
          static: {
            fixed: [
              {
                value: this.mainWeapon.refinement,
                origin: "mainWeapon.refinement",
              },
            ],
            percentage: [
              {
                value: Math.pow(this.mainWeapon.refinement, 2),
                origin: "mainWeapon.refinement",
              },
            ],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.subWeaAtk = {
        baseValue: this.staticTotalValue(this.subWeapon.baseAtk),
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.totalWeaAtk = {
        baseValue: 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.pAtk = {
        baseValue:
          this.lv +
          this.staticTotalValue(this.mainWeaAtk) +
          CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.pAtkT * this.staticTotalValue(this.str) +
          CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.pAtkT * this.staticTotalValue(this.int) +
          CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.pAtkT * this.staticTotalValue(this.agi) +
          CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.pAtkT * this.staticTotalValue(this.dex),
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.mAtk = {
        baseValue:
          this.lv +
          this.staticTotalValue(this.weaMatkT) * this.staticTotalValue(this.mainWeaAtk) +
          CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.mAtkT * this.staticTotalValue(this.str) +
          CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.mAtkT * this.staticTotalValue(this.int) +
          CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.mAtkT * this.staticTotalValue(this.agi) +
          CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.mAtkT * this.staticTotalValue(this.dex),
        // 武器攻击力在后续附加
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.unsheatheAtk = {
        baseValue: 100,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.aspd = {
        baseValue:
          CharacterAttr.weaponAbiT[mainWeaponType].baseAspd +
          this.lv +
          CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.aspdT * this.staticTotalValue(this.str) +
          CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.aspdT * this.staticTotalValue(this.int) +
          CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.aspdT * this.staticTotalValue(this.agi) +
          CharacterAttr.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.aspdT * this.staticTotalValue(this.dex),
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.cspd = {
        baseValue: this.staticTotalValue(this.dex) * 2.94 + this.staticTotalValue(this.agi) * 1.16,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };

      this.hp = {
        baseValue: this.staticTotalValue(this.maxHP),
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.mp = {
        baseValue: this.staticTotalValue(this.maxMP),
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.ampr = {
        baseValue: 10 + this.staticTotalValue(this.maxMP) / 10,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.aggro = {
        baseValue: 100,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      // 添加加成项
      // 被动技能加成
      character.skillList?.skills.forEach((skill) => {
        if (skill.skillType === "PASSIVE_SKILL") {
          skill.skillEffect.forEach((effect) => {
            effect.skillYield.forEach((yielder) => {
              if (yielder.yieldFormula) {
              }
            });
          });
        }
      });
      // 主武器加成
      character.equipmentList?.mainWeapon?.modifiersList?.modifiers.forEach((modifier) => {
        if (modifier.modifiersValueType === "PERCENTAGE_BONUS") {
        } else if (modifier.modifiersValueType === "FLAT_BONUS") {
        }
      });
    }

    public inherit = (otherCharacter: CharacterAttr) => {
      const copy = JSON.parse(JSON.stringify(otherCharacter)) as CharacterAttr;
      Object.assign(this, copy);
    };

    public baseValue = (m: modifiers): number => {
      return m.baseValue;
    };

    private staticFixedValue = (m: modifiers): number => {
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

    private staticPercentageValue = (m: modifiers): number => {
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

    private staticTotalValue = (m: modifiers): number => {
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

    get state() {
      return {
        lv: this.lv,
        str: this.dynamicTotalValue(this.str),
        int: this.dynamicTotalValue(this.int),
        vit: this.dynamicTotalValue(this.vit),
        agi: this.dynamicTotalValue(this.agi),
        dex: this.dynamicTotalValue(this.dex),
        luk: this.dynamicTotalValue(this.luk),
        tec: this.dynamicTotalValue(this.tec),
        cri: this.dynamicTotalValue(this.cri),
        men: this.dynamicTotalValue(this.men),
        pPie: this.dynamicTotalValue(this.pPie),
        mPie: this.dynamicTotalValue(this.mPie),
        pStab: this.dynamicTotalValue(this.pStab),
        nDis: this.dynamicTotalValue(this.nDis),
        fDis: this.dynamicTotalValue(this.fDis),
        crT: this.dynamicTotalValue(this.crT),
        cdT: this.dynamicTotalValue(this.cdT),
        mainWeaAtk: this.dynamicTotalValue(this.mainWeaAtk),
        subWeaAtk: this.dynamicTotalValue(this.subWeaAtk),
        totalWeaAtk: this.dynamicTotalValue(this.totalWeaAtk),
        pAtk: this.dynamicTotalValue(this.pAtk),
        mAtk: this.dynamicTotalValue(this.mAtk),
        unsheatheAtk: this.dynamicTotalValue(this.unsheatheAtk),
        aspd: this.dynamicTotalValue(this.aspd),
        cspd: this.dynamicTotalValue(this.cspd),
        am: this.dynamicTotalValue(this.am),
        cm: this.dynamicTotalValue(this.cm),
        hp: this.dynamicTotalValue(this.hp),
        mp: this.dynamicTotalValue(this.mp),
        ampr: this.dynamicTotalValue(this.ampr),
        aggro: this.dynamicTotalValue(this.aggro),
      };
    }
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
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.pDef = {
        baseValue: monsterState.physicalDefense ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.pRes = {
        baseValue: monsterState.physicalResistance ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.mDef = {
        baseValue: monsterState.magicalDefense ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
      this.mRes = {
        baseValue: monsterState.magicalResistance ?? 0,
        modifiers: {
          static: {
            fixed: [],
            percentage: [],
          },
          dynamic: {
            fixed: [],
            percentage: [],
          },
        },
      };
    }

    public inherit = (otherMonsterAttr: MonsterAttr) => {
      const copy = JSON.parse(JSON.stringify(otherMonsterAttr)) as MonsterAttr;
      Object.assign(this, copy);
    };

    public baseValue = (m: modifiers): number => {
      return m.baseValue;
    };

    private staticFixedValue = (m: modifiers): number => {
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

    private staticPercentageValue = (m: modifiers): number => {
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
      skillFrame: number;
    };
    characterAttr: CharacterAttr;
    monsterAttr: MonsterAttr;
  }

  interface eventSequenceType {
    counter: {
      type: "PerFrame" | "PerSkill";
      value: number;
    };
    event: () => void;
    origin: string;
  }

  const calculateFrameData = (skillSequence: skillSequenceType[], character: Character, monster: Monster) => {
    const frameDatas: FrameData[] = [];
    let skillIndex = 0;
    let skillFrame = 0;
    let skillTotalFrame = 0;
    let eventSequence: eventSequenceType[] = [];
    const tempCharacterAttr = new CharacterAttr(character);
    const tempMonsterAttr = new MonsterAttr(monster);

    // 设置上限20分钟 = 60 * 60 * 20
    for (let frame = 0; frame < 7200; frame++) {
      // debugger;
      // 每帧需要做的事
      frame !== 0 && skillFrame++;
      const characterAttr = new CharacterAttr(character);
      const monsterAttr = new MonsterAttr(monster);
      const currentSkill = skillSequence[skillIndex]!;

      // 读取上一帧的数据
      characterAttr.inherit(tempCharacterAttr);
      monsterAttr.inherit(tempMonsterAttr);

      // 定义计算上下文
      const computeArg = {
        p: {
          ...characterAttr,
        },
        m: {
          ...monsterAttr,
        },
        s: {
          lv: currentSkill.level,
          skillFrame,
        },
      };

      // 封装当前状态的公式计算方法
      const evaluate = (formula: string) => {
        return math.evaluate(formula, { ...computeArg }) as number | void;
      };

      monsterAttr.hp.modifiers.dynamic.fixed.push({
        value: -100000,
        origin: "测试阶段系统自动减损" + frame,
      });

      // 检查怪物死亡
      if (computeArg.m.dynamicTotalValue(computeArg.m.hp) <= 0) {
        console.log("怪物死亡");
        break;
      }

      // 定义新序列防止删除元素时索引发生混乱
      const newEventSequence: eventSequenceType[] = [];
      eventSequence.forEach((event) => {
        if (event.counter.type === "PerFrame") {
          event.counter.value--;
          // 执行当前帧需要做的事
          if (event.counter.value === 0) {
            event.event();
          }
          // 将未来需要做的事放在新序列中
          if (event.counter.value > 0) {
            newEventSequence.push(event);
          }
        }
      });

      // 当前技能执行完毕时，计算下一个技能的持续时长
      if (skillFrame === skillTotalFrame) {
        // 每使用一个技能时需要做的事
        if (frame > 0) {
          skillIndex++;
          // 重置技能帧计数
          skillFrame = 0;
        }
        // 执行由技能数触发的效果
        eventSequence.forEach((event) => {
          if (event.counter.type === "PerSkill") {
            event.counter.value--;
            // 执行当前技能发动时额外需要做的事
            if (event.counter.value === 0) {
              event.event();
            }
            // 将未来需要做的事放在新序列中
            if (event.counter.value > 0) {
              newEventSequence.push(event);
            }
          }
        });
        const newSkill = skillSequence[skillIndex];
        if (!newSkill) {
          console.log("末端技能为：" + currentSkill.name + "，技能序列执行完毕");
          break;
        }
        // 动态计算当前行动速度和咏唱加速
        const currentAm = computeArg.p.dynamicTotalValue(computeArg.p.am);
        const currentCm = computeArg.p.dynamicTotalValue(computeArg.p.cm);
        // console.log("执行到：" + newSkill.name);
        // 计算与帧相关的技能效果参数
        // 固定动画时长
        const aDurationBaseValue = evaluate(newSkill.skillEffect.actionBaseDurationFormula) as number;
        // console.log("动画固定时长（帧）：" + aDurationBaseValue);
        // 可加速动画时长
        const aDurationModifiableValue = evaluate(newSkill.skillEffect.actionModifiableDurationFormula) as number;
        // console.log("动画可加速时长（帧）：" + aDurationModifiableValue);
        // 实际动画时长
        const aDurationActualValue = aDurationBaseValue + (aDurationModifiableValue * (100 - currentAm)) / 100;
        // console.log("当前行动速度：" + currentAm + "%，动画实际时长（帧）：" + aDurationActualValue);

        // 固定咏唱时长
        const cDurationBaseValue = evaluate(newSkill.skillEffect.castingBaseDurationFormula) as number;
        // console.log("咏唱固定时长（秒）：" + cDurationBaseValue);
        // 可加速咏唱时长
        const cDurationModifiableValue = evaluate(newSkill.skillEffect.castingModifiableDurationFormula) as number;
        // console.log("咏唱可加速时长（秒）：" + cDurationModifiableValue);
        // 实际咏唱时长
        const cDurationActualValue = cDurationBaseValue + (cDurationModifiableValue * (100 - currentCm)) / 100;
        // console.log("当前咏唱缩减" + currentCm + "%，咏唱实际时长（秒）：" + cDurationActualValue);
        skillTotalFrame = math.floor(aDurationActualValue + cDurationActualValue * 60);
        // console.log("技能总时长（帧）：" + skillTotalFrame);

        newSkill.skillEffect.skillCost.map((cost) => {
          const node = math.parse(cost.costFormula);
          node.traverse(function (node, path, parent) {
            switch (node.type) {
              case 'OperatorNode':
                console.log(node.type, node.op)
                break
              case 'ConstantNode':
                console.log(node.type, node.value)
                break
              case 'SymbolNode':
                console.log(node.type, node.name)
                break
              default:
                console.log(node.type)
            }
          })
        });
        // newSkill.skillEffect.skillYield.map((yield_) => {

        // })
      }

      frameDatas.push({
        skillAttr: {
          currentSkillName: currentSkill.name,
          skillFrame: skillFrame,
        },
        characterAttr: characterAttr,
        monsterAttr: monsterAttr,
      });

      // 将新序列赋值
      eventSequence = newEventSequence;
      // 将当前状态储存供下一帧使用
      tempCharacterAttr.inherit(characterAttr);
      tempMonsterAttr.inherit(monsterAttr);
    }
    return frameDatas;
  };

  const result = calculateFrameData(skillSequence, test.character, test.monster);

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
              {dictionary.ui.analyze.discription}
            </div>
            <div></div>
          </div>
          <div className="Content flex flex-col">
            <div className="Result my-10 flex items-end">
              <div className="DPS flex items-end gap-2">
                <span className="Key py-2 text-sm">DPS</span>
                <span className="Value text-8xl">{math.floor(test.monster.maxhp / (result.length / 60))}</span>
              </div>
            </div>
            <div className="TimeLine flex w-fit bg-transition-color-8 p-4">
              {result.map((frameData, frameIndex) => {
                return (
                  <div key={frameIndex} className="frame flex flex-col gap-1">
                    <div className="frameData flex">
                      <div className="group relative min-h-6 border-2 border-brand-color-2nd">
                        <div className="absolute -left-4 bottom-6 z-10 hidden w-[50dvw] flex-col gap-2 rounded bg-primary-color-90 p-4 shadow-2xl shadow-transition-color-20 backdrop-blur-xl group-hover:flex">
                          <div className="SkillAttr flex flex-col gap-1">
                            <span className="Title">Skill</span>
                            <span className="Content bg-transition-color-8">
                              {JSON.stringify(frameData.skillAttr.currentSkillName, null, 2)} :{" "}
                              {JSON.stringify(frameData.skillAttr.skillFrame, null, 2)}
                            </span>
                          </div>
                          <div className="CharacterAttr flex flex-col gap-1">
                            <span className="Title">CharacterAttr</span>
                            <span className="Content bg-transition-color-8">
                              mp:
                              {JSON.stringify(frameData.characterAttr.state.mp, null, 2)}
                              <br />
                              aspd:
                              {JSON.stringify(frameData.characterAttr.state.aspd, null, 2)}
                              <br />
                              cspd:
                              {JSON.stringify(frameData.characterAttr.state.cspd, null, 2)}
                            </span>
                          </div>
                          <div className="CharacterAttr flex flex-col gap-1">
                            <span className="Title">MonsterAttr</span>
                            <span className="Content bg-transition-color-8">
                              hp:
                              {JSON.stringify(
                                frameData.monsterAttr.dynamicTotalValue(frameData.monsterAttr.hp),
                                null,
                                2,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
