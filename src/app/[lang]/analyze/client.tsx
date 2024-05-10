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

interface tSkill {
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
  const skillSequence: tSkill[] = [
    {
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "MFP-CT",
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
        chargingBaseDurationFormula: "",
        chargingModifiableDurationFormula: "",
        chantingBaseDurationFormula: "0",
        chantingModifiableDurationFormula: "0",
        skillWindUpFormula: "0",
        skillRecoveryFormula: "0",
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
            mutationTimingFormula: "frame % 60 == 0",
            yieldFormula: "p.mfp = p.mfp + ( p.mfp >= 100 ? 1/3 : 1 )",
            skillEffectId: null,
          },
        ],
      },
    },
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
        skillExtraActionType: "Chanting",
        chargingBaseDurationFormula: "",
        chargingModifiableDurationFormula: "",
        chantingBaseDurationFormula: "0",
        chantingModifiableDurationFormula: "max(0,min((2 - (s.lv - 1) * 0.25),(1 - (s.lv - 5) * 0.5)))",
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
            yieldFormula: "(vMatk + 200) * 500%",
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
        skillExtraActionType: "Chanting",
        chargingBaseDurationFormula: "",
        chargingModifiableDurationFormula: "",
        chantingBaseDurationFormula: "0",
        chantingModifiableDurationFormula: "8",
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

  // 参数统计方法
  const baseValue = (m: modifiers): number => {
    return m.baseValue;
  };

  const staticFixedValue = (m: modifiers): number => {
    const fixedArray = m.modifiers.static.fixed.map((mod) => mod.value);
    return fixedArray.reduce((a, b) => a + b, 0);
  };

  const dynamicFixedValue = (m: modifiers): number => {
    let value = 0;
    if (m.modifiers.dynamic?.fixed) {
      const fixedArray = m.modifiers.dynamic.fixed.map((mod) => mod.value);
      value = fixedArray.reduce((a, b) => a + b, 0) + staticFixedValue(m);
    }
    return value;
  };

  const staticPercentageValue = (m: modifiers): number => {
    const percentageArray = m.modifiers.static.percentage.map((mod) => mod.value);
    return percentageArray.reduce((a, b) => a + b, 0);
  };

  const dynamicPercentageValue = (m: modifiers): number => {
    let value = 0;
    if (m.modifiers.dynamic?.percentage) {
      const percentageArray = m.modifiers.dynamic.percentage.map((mod) => mod.value);
      value = percentageArray.reduce((a, b) => a + b, 0) + staticPercentageValue(m);
    }
    return value;
  };

  const staticTotalValue = (m: modifiers): number => {
    const base = baseValue(m);
    const fixed = staticFixedValue(m);
    const percentage = staticPercentageValue(m);
    return base * (1 + percentage / 100) + fixed;
  };

  const dynamicTotalValue = (m: modifiers): number => {
    const base = baseValue(m);
    const fixed = dynamicFixedValue(m);
    const percentage = dynamicPercentageValue(m);
    return base * (1 + percentage / 100) + fixed;
  };

  class CharacterClass {
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
    _lv: number;
    _str: modifiers;
    _int: modifiers;
    _vit: modifiers;
    _agi: modifiers;
    _dex: modifiers;
    _luk: modifiers;
    _cri: modifiers;
    _tec: modifiers;
    _men: modifiers;
    _mainWeapon: {
      type: MainWeaType;
      baseAtk: modifiers;
      refinement: number;
      stability: number;
    };
    _subWeapon: {
      type: SubWeaType;
      baseAtk: modifiers;
      refinement: number;
      stability: number;
    };
    _bodyArmor: {
      type: BodyArmorType;
      baseDef: modifiers;
      refinement: number;
    };
    // 系统数值：由系统决定基础值，加成项由自由数值决定的
    _pPie: modifiers;
    _mPie: modifiers;
    _pStab: modifiers;
    _nDis: modifiers;
    _fDis: modifiers;
    _crT: modifiers;
    _cdT: modifiers;
    _weaMatkT: modifiers;
    _unsheatheAtk: modifiers;
    _stro: modifiers;
    _total: modifiers;
    _final: modifiers;
    _am: modifiers;
    _cm: modifiers;
    _aggro: modifiers;
    // 衍生属性：基础值由自由数值决定，玩家只能定义加成项的
    _maxHP: modifiers;
    _maxMP: modifiers;
    _pCr: modifiers;
    _pCd: modifiers;
    _mainWeaponAtk: modifiers;
    _subWeaponAtk: modifiers;
    _totalWeaponAtk: modifiers;
    _pAtk: modifiers;
    _mAtk: modifiers;
    _aspd: modifiers;
    _cspd: modifiers;
    // 再衍生属性
    _ampr: modifiers;
    _hp: modifiers;
    _mp: modifiers;

    constructor(character: Character) {
      const mainWeaponType = character.equipmentList?.mainWeapon?.mainWeaType ?? "NO_WEAPOEN";
      const subWeaponType = character.equipmentList?.subWeapon?.subWeaType ?? "NO_WEAPOEN";
      const bodyArmorType = character.equipmentList?.bodyArmor?.bodyArmorType ?? "NORMAL";
      // 计算基础值

      this._lv = character.lv;
      this._str = {
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
      this._int = {
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
      this._vit = {
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
      this._agi = {
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
      this._dex = {
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
      this._luk = {
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
      this._tec = {
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
      this._men = {
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
      this._cri = {
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
      this._mainWeapon = {
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
      this._subWeapon = {
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
      this._bodyArmor = {
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

      this._pPie = {
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
      this._mPie = {
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
      this._pStab = {
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
                    CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.stabT * staticTotalValue(this._str) +
                      CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.stabT *
                        staticTotalValue(this._int) +
                      CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.stabT *
                        staticTotalValue(this._agi) +
                      CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.stabT *
                        staticTotalValue(this._dex),
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
      this._nDis = {
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
      this._fDis = {
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
      this._crT = {
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
      this._cdT = {
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
      this._weaMatkT = {
        baseValue: CharacterClass.weaponAbiT[mainWeaponType].weaAtk_Matk_Convert,
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
      this._stro = {
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
      this._unsheatheAtk = {
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
      this._total = {
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
      this._final = {
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
      this._am = {
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
      this._cm = {
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
      this._aggro = {
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

      this._maxHP = {
        baseValue: Math.floor(93 + this.lv * (127 / 17 + staticTotalValue(this._vit) / 3)),
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
      this._maxMP = {
        baseValue: Math.floor(99 + this.lv + staticTotalValue(this._int) / 10 + staticTotalValue(this._tec)),
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
      this._pCr = {
        baseValue: 25 + staticTotalValue(this._cri) / 5,
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
      this._pCd = {
        baseValue:
          150 +
          Math.floor(
            Math.max(staticTotalValue(this._str) / 5, staticTotalValue(this._str) + staticTotalValue(this._agi)) / 10,
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
      this._mainWeaponAtk = {
        baseValue: Math.floor(staticTotalValue(this._mainWeapon.baseAtk)),
        modifiers: {
          static: {
            fixed: [
              {
                value: this._mainWeapon.refinement,
                origin: "mainWeapon.refinement",
              },
            ],
            percentage: [
              {
                value: Math.pow(this._mainWeapon.refinement, 2),
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
      this._subWeaponAtk = {
        baseValue: staticTotalValue(this._subWeapon.baseAtk),
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
      this._totalWeaponAtk = {
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
      this._pAtk = {
        baseValue:
          this.lv +
          staticTotalValue(this._mainWeaponAtk) +
          CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.pAtkT * staticTotalValue(this._str) +
          CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.pAtkT * staticTotalValue(this._int) +
          CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.pAtkT * staticTotalValue(this._agi) +
          CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.pAtkT * staticTotalValue(this._dex),
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
      this._mAtk = {
        baseValue:
          this.lv +
          staticTotalValue(this._weaMatkT) * staticTotalValue(this._mainWeaponAtk) +
          CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.mAtkT * staticTotalValue(this._str) +
          CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.mAtkT * staticTotalValue(this._int) +
          CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.mAtkT * staticTotalValue(this._agi) +
          CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.mAtkT * staticTotalValue(this._dex),
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
      this._aspd = {
        baseValue:
          CharacterClass.weaponAbiT[mainWeaponType].baseAspd +
          this.lv +
          CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.aspdT * staticTotalValue(this._str) +
          CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.aspdT * staticTotalValue(this._int) +
          CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.aspdT * staticTotalValue(this._agi) +
          CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.aspdT * staticTotalValue(this._dex),
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
      this._cspd = {
        baseValue: staticTotalValue(this._dex) * 2.94 + staticTotalValue(this._agi) * 1.16,
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

      this._hp = {
        baseValue: staticTotalValue(this._maxHP),
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
      this._mp = {
        baseValue: staticTotalValue(this._maxMP),
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
      this._ampr = {
        baseValue: 10 + staticTotalValue(this._maxMP) / 10,
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

    public inherit = (otherCharacter: CharacterClass) => {
      const copy = JSON.parse(JSON.stringify(otherCharacter)) as CharacterClass;
      Object.assign(this, copy);
    };

    get lv() {
      return this._lv;
    }
    get str() {
      return dynamicTotalValue(this._str);
    }
    get int() {
      return dynamicTotalValue(this._int);
    }
    get vit() {
      return dynamicTotalValue(this._vit);
    }
    get dex() {
      return dynamicTotalValue(this._dex);
    }
    get agi() {
      return dynamicTotalValue(this._agi);
    }
    get luk() {
      return dynamicTotalValue(this._luk);
    }
    get tec() {
      return dynamicTotalValue(this._tec);
    }
    get cri() {
      return dynamicTotalValue(this._cri);
    }
    get men() {
      return dynamicTotalValue(this._men);
    }
    get mainWeaponType() {
      return this._mainWeapon.type;
    }
    get mainWeaponBaseAtk() {
      return dynamicTotalValue(this._mainWeapon.baseAtk);
    }
    get mainWeaponRefinement() {
      return this._mainWeapon.refinement;
    }
    get mainWeaponStability() {
      return this._mainWeapon.stability;
    }
    get subWeaponType() {
      return this._subWeapon.type;
    }
    get subWeaponBaseAtk() {
      return dynamicTotalValue(this._subWeapon.baseAtk);
    }
    get subWeaponRefinement() {
      return this._subWeapon.refinement;
    }
    get subWeaponStability() {
      return this._subWeapon.stability;
    }
    get bodyArmorType() {
      return this._bodyArmor.type;
    }
    get bodyArmorBaseDef() {
      return dynamicTotalValue(this._bodyArmor.baseDef);
    }
    get bodyArmorRefinement() {
      return this._bodyArmor.refinement;
    }
    get pPie() {
      return dynamicTotalValue(this._pPie);
    }
    get mPie() {
      return dynamicTotalValue(this._mPie);
    }
    get pStab() {
      return dynamicTotalValue(this._pStab);
    }
    get nDis() {
      return dynamicTotalValue(this._nDis);
    }
    get fDis() {
      return dynamicTotalValue(this._fDis);
    }
    get crT() {
      return dynamicTotalValue(this._crT);
    }
    get cdT() {
      return dynamicTotalValue(this._cdT);
    }
    get weaMatkT() {
      return dynamicTotalValue(this._weaMatkT);
    }
    get stro() {
      return dynamicTotalValue(this._stro);
    }
    get unsheatheAtk() {
      return dynamicTotalValue(this._unsheatheAtk);
    }
    get total() {
      return dynamicTotalValue(this._total);
    }
    get final() {
      return dynamicTotalValue(this._final);
    }
    get am() {
      return dynamicTotalValue(this._am);
    }
    get cm() {
      return dynamicTotalValue(this._cm);
    }
    get aggro() {
      return dynamicTotalValue(this._aggro);
    }
    get maxHP() {
      return dynamicTotalValue(this._maxHP);
    }
    get maxMP() {
      return dynamicTotalValue(this._maxMP);
    }
    get pCr() {
      return dynamicTotalValue(this._pCr);
    }
    get pCd() {
      return dynamicTotalValue(this._pCd);
    }
    get mainWeaponAtk() {
      return dynamicTotalValue(this._mainWeaponAtk);
    }
    get subWeaponAtk() {
      return dynamicTotalValue(this._subWeaponAtk);
    }
    get totalWeaponAtk() {
      return dynamicTotalValue(this._totalWeaponAtk);
    }
    get pAtk() {
      return dynamicTotalValue(this._pAtk);
    }
    get mAtk() {
      return dynamicTotalValue(this._mAtk);
    }
    get aspd() {
      return dynamicTotalValue(this._aspd);
    }
    get cspd() {
      return dynamicTotalValue(this._cspd);
    }
    get hp() {
      return dynamicTotalValue(this._hp);
    }
    get mp() {
      return dynamicTotalValue(this._mp);
    }
    get ampr() {
      return dynamicTotalValue(this._ampr);
    }
  }

  class MonsterClass {
    _lv: number;
    _hp: modifiers;
    _pDef: modifiers;
    _pRes: modifiers;
    _mDef: modifiers;
    _mRes: modifiers;
    _cRes: modifiers;
    test: number;
    constructor(monster: Monster) {
      this._lv = monster.baseLv ?? 0;
      this._hp = {
        baseValue: monster.maxhp ?? 0,
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
      this._pDef = {
        baseValue: monster.physicalDefense ?? 0,
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
      this._pRes = {
        baseValue: monster.physicalResistance ?? 0,
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
      this._mDef = {
        baseValue: monster.magicalDefense ?? 0,
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
      this._mRes = {
        baseValue: monster.magicalResistance ?? 0,
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
      this._cRes = {
        baseValue: monster.criticalResistance ?? 0,
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
      this.test = 200;
    }
    get lv() {
      return this._lv;
    }
    get hp() {
      return dynamicTotalValue(this._hp);
    }
    get pDef() {
      return dynamicTotalValue(this._pDef);
    }
    get pRes() {
      return dynamicTotalValue(this._pRes);
    }
    get mDef() {
      return dynamicTotalValue(this._mDef);
    }
    get mRes() {
      return dynamicTotalValue(this._mRes);
    }
    get cRes() {
      return dynamicTotalValue(this._cRes);
    }

    public inherit = (otherMonsterClass: MonsterClass) => {
      const copy = JSON.parse(JSON.stringify(otherMonsterClass)) as MonsterClass;
      Object.assign(this, copy);
    };
  }

  class SkillClass {
    _lv: number;
    _am: modifiers;
    _cm: modifiers;
    constructor(skill: tSkill, character: Character, monster: Monster) {
      const c = new CharacterClass(character);
      const m = new MonsterClass(monster);
      this._lv = skill.level ?? 0;
      this._am = {
        baseValue: c.am,
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
      this._cm = {
        baseValue: c.cm,
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
    get lv() {
      return this._lv;
    }
    get am() {
      return dynamicTotalValue(this._am);
    }
    get cm() {
      return dynamicTotalValue(this._cm);
    }
  }

  class TestClass {
    a: number;
    b: string;
    c: boolean;
    constructor() {
      this.a = 100;
      this.b = "ssss";
      this.c = false;
    }
  }

  interface FrameData {
    skillAttr: {
      currentSkillName: string;
      skillFrame: number;
    };
    characterAttr: CharacterClass;
    monsterAttr: MonsterClass;
  }

  interface eventSequenceType {
    condition: string;
    behavior: string;
    origin: string;
  }

  const calculateFrameData = (skillSequence: tSkill[], character: Character, monster: Monster) => {
    const frameDatas: FrameData[] = [];
    let skillIndex = 0;
    let skillFrame = 0;
    let skillTotalFrame = 0;
    let eventSequence: eventSequenceType[] = [];
    const tempCharacterClass = new CharacterClass(character);
    const tempMonsterClass = new MonsterClass(monster);

    // 设置上限20分钟 = 60 * 60 * 20
    for (let frame = 0; frame < 720; frame++) {
      // debugger;
      // 每帧需要做的事
      frame !== 0 && skillFrame++;
      const characterAttr = new CharacterClass(character);
      const monsterAttr = new MonsterClass(monster);
      const currentSkill = skillSequence[skillIndex]!;
      const skillAttr = new SkillClass(currentSkill, character, monster);

      // 读取上一帧的数据
      characterAttr.inherit(tempCharacterClass);
      monsterAttr.inherit(tempMonsterClass);

      // 定义计算上下文
      const computeArg = {
        p: characterAttr,
        m: monsterAttr,
        s: skillAttr,
        t: {
          get a() {
            return 0;
          }
        },
        get frame() {
          return frame;
        },
        get skillIdex() {
          return skillIndex;
        },
        get vMatk() {
          return (
            ((this.p.mAtk + this.p.lv - this.m.lv) * (100 - this.m.mRes)) / 100 - (100 - this.p.mPie) * this.m.mDef
          );
        },
        get vPatk() {
          return (
            ((this.p.pAtk + this.p.lv - this.m.lv) * (100 - this.m.pRes)) / 100 - (100 - this.p.pPie) * this.m.pDef
          );
        },
      };

      // 封装当前状态的公式计算方法
      const evaluate = (formula: string) => {
        // console.log(formula, computeArg);
        console.log(math.evaluate("t.a", {...computeArg}));
        return math.evaluate(formula, { ...computeArg }) as number | void;
      };

      monsterAttr._hp.modifiers.dynamic.fixed.push({
        value: -100000,
        origin: "测试阶段系统自动减损" + frame,
      });

      // 检查怪物死亡
      if (computeArg.m.hp <= 0) {
        console.log("怪物死亡");
        break;
      }

      // 定义新序列防止删除元素时索引发生混乱
      const newEventSequence: eventSequenceType[] = [];
      eventSequence.forEach((event) => {
        if (evaluate(event.condition)) {
          // 执行当前帧需要做的事
          // console.log("上下文：", computeArg);
          // console.log("当前Frame：" + frame + "，条件：" + event.condition + "成立，执行：" + event.behavior);
          const node = math.parse(event.behavior);
          if (node.type === "AssignmentNode") {
            const nodeString = node.toString();
            // console.log("发现赋值节点：", nodeString);
            // 寻找赋值对象
            const attr = nodeString.substring(0, nodeString.indexOf("=")).trim();
            console.log("赋值对象：", attr);
          }
          // console.log("结果：", computeArg)
        } else {
          // 将未来需要做的事放在新序列中
          newEventSequence.push(event);
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
        const newSkill = skillSequence[skillIndex];
        if (!newSkill) {
          console.log("末端技能为：" + currentSkill.name + "，技能序列执行完毕");
          break;
        }
        // 动态计算当前动作加速和咏唱加速
        const currentAm = math.max(50, math.min(0, computeArg.s.am));
        const currentCm = math.max(50, math.min(0, computeArg.s.cm));
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
        const cDurationBaseValue = evaluate(newSkill.skillEffect.chantingBaseDurationFormula as string) as number;
        // console.log("咏唱固定时长（秒）：" + cDurationBaseValue);
        // 可加速咏唱时长
        const cDurationModifiableValue = evaluate(
          newSkill.skillEffect.chantingModifiableDurationFormula as string,
        ) as number;
        // console.log("咏唱可加速时长（秒）：" + cDurationModifiableValue);
        // 实际咏唱时长
        const cDurationActualValue = cDurationBaseValue + (cDurationModifiableValue * (100 - currentCm)) / 100;
        // console.log("当前咏唱缩减" + currentCm + "%，咏唱实际时长（秒）：" + cDurationActualValue);
        skillTotalFrame = math.floor(aDurationActualValue + cDurationActualValue * 60);
        // console.log("技能总时长（帧）：" + skillTotalFrame);

        // newSkill.skillEffect.skillCost.map((cost) => {
        //   const node = math.parse(cost.costFormula);
        //   node.traverse(function (node) {
        //     switch (node.type) {
        //       case "OperatorNode":
        //         console.log(node.type, node.toString());
        //         break;
        //       case "ConstantNode":
        //         console.log(node.type, node.toString());
        //         break;
        //       case "SymbolNode":
        //         console.log(node.type, node.toString());
        //         break;
        //       default:
        //         console.log(node.type, node.toString());
        //     }
        //   });
        // });
        // newSkill.skillEffect.skillYield.forEach((yield_) => {
        //   newEventSequence.push({
        //     behavior: yield_.yieldFormula,
        //     condition: yield_.mutationTimingFormula ?? "true",
        //     origin: newSkill.name,
        //   });
        // });
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
      tempCharacterClass.inherit(characterAttr);
      tempMonsterClass.inherit(monsterAttr);
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
                          <div className="CharacterClass flex flex-col gap-1">
                            <span className="Title">CharacterClass</span>
                            <span className="Content bg-transition-color-8">
                              mp:
                              {JSON.stringify(frameData.characterAttr.mp, null, 2)}
                              <br />
                              aspd:
                              {JSON.stringify(frameData.characterAttr.aspd, null, 2)}
                              <br />
                              cspd:
                              {JSON.stringify(frameData.characterAttr.cspd, null, 2)}
                            </span>
                          </div>
                          <div className="CharacterClass flex flex-col gap-1">
                            <span className="Title">MonsterClass</span>
                            <span className="Content bg-transition-color-8">
                              hp:
                              {JSON.stringify(frameData.monsterAttr.hp, null, 2)}
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
