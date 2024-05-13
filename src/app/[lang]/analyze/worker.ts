import _ from "lodash-es";
import { type MainWeaType, type SubWeaType, type BodyArmorType, type $Enums } from "@prisma/client";
import * as math from "mathjs";
import { type Character } from "~/server/api/routers/character";
import { type Monster } from "~/server/api/routers/monster";
import { type SkillEffect } from "~/server/api/routers/skill";

export type analyzeWorkerInput = {
  type: "start" | "stop";
  arg?: {
    skillSequence: tSkill[];
    character: Character;
    monster: Monster;
  };
};

export type analyzeWorkerOutput = {
  type: "progress" | "success" | "error";
  computeResult: computerArgType[] | string;
};

export type modifiers = {
  baseValue: number;
  modifiers: {
    static: {
      fixed: {
        value: number;
        origin: string;
      }[];
      percentage: {
        value: number;
        origin: string;
      }[];
    };
    dynamic: {
      fixed: {
        value: number;
        origin: string;
      }[];
      percentage: {
        value: number;
        origin: string;
      }[];
    };
  };
};

export type pTpye = {
  lv: number;
  str: number;
  int: number;
  vit: number;
  dex: number;
  agi: number;
  luk: number;
  tec: number;
  cri: number;
  men: number;
  mainWeaponType: MainWeaType;
  mainWeaponBaseAtk: number;
  mainWeaponRefinement: number;
  mainWeaponStability: number;
  subWeaponType: SubWeaType;
  subWeaponBaseAtk: number;
  subWeaponRefinement: number;
  subWeaponStability: number;
  bodyArmorType: BodyArmorType;
  bodyArmorBaseDef: number;
  bodyArmorRefinement: number;
  pPie: number;
  mPie: number;
  pStab: number;
  nDis: number;
  fDis: number;
  crT: number;
  cdT: number;
  weaMatkT: number;
  stro: number;
  unsheatheAtk: number;
  total: number;
  final: number;
  am: number;
  cm: number;
  aggro: number;
  maxHP: number;
  maxMP: number;
  pCr: number;
  pCd: number;
  mainWeaponAtk: number;
  subWeaponAtk: number;
  totalWeaponAtk: number;
  pAtk: number;
  mAtk: number;
  aspd: number;
  cspd: number;
  hp: number;
  mp: number;
  ampr: number;
};

export type mType = {
  name: string;
  lv: number;
  hp: number;
  pDef: number;
  mDef: number;
  pRes: number;
  mRes: number;
  cRes: number;
};

export type sType = {
  name: string;
  lv: number;
  am: number;
  cm: number;
};

export type computerArgType = {
  p: pTpye;
  m: mType;
  s: sType;
  frame: number;
  skillIdex: number;
  skillFrame: number;
  vMatk: number;
  vPatk: number;
};

export type tSkill = {
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
};

export type eventSequenceType = {
  type: $Enums.YieldType;
  condition: string;
  behavior: string;
  origin: string;
  registrationFrame: number;
};

// 参数统计方法
export const baseValue = (m: modifiers): number => {
  return m.baseValue;
};

export const staticFixedValue = (m: modifiers): number => {
  const fixedArray = m.modifiers.static.fixed.map((mod) => mod.value);
  return fixedArray.reduce((a, b) => a + b, 0);
};

export const dynamicFixedValue = (m: modifiers): number => {
  let value = 0;
  if (m.modifiers.dynamic?.fixed) {
    const fixedArray = m.modifiers.dynamic.fixed.map((mod) => mod.value);
    value = fixedArray.reduce((a, b) => a + b, 0) + staticFixedValue(m);
  }
  return value;
};

export const staticPercentageValue = (m: modifiers): number => {
  const percentageArray = m.modifiers.static.percentage.map((mod) => mod.value);
  return percentageArray.reduce((a, b) => a + b, 0);
};

export const dynamicPercentageValue = (m: modifiers): number => {
  let value = 0;
  if (m.modifiers.dynamic?.percentage) {
    const percentageArray = m.modifiers.dynamic.percentage.map((mod) => mod.value);
    value = percentageArray.reduce((a, b) => a + b, 0) + staticPercentageValue(m);
  }
  return value;
};

export const staticTotalValue = (m: modifiers): number => {
  const base = baseValue(m);
  const fixed = staticFixedValue(m);
  const percentage = staticPercentageValue(m);
  return base * (1 + percentage / 100) + fixed;
};

export const dynamicTotalValue = (m: modifiers): number => {
  const base = baseValue(m);
  const fixed = dynamicFixedValue(m);
  const percentage = dynamicPercentageValue(m);
  return base * (1 + percentage / 100) + fixed;
};

export class CharacterClass {
  // 武器的能力值-属性转化率
  static weaponAbiT: Record<
    MainWeaType,
    {
      baseHit: number;
      baseAspd: number;
      weaAtk_Matk_Convert: number;
      weaAtk_Patk_Convert: number;
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
      weaAtk_Patk_Convert: 1,
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
      weaAtk_Patk_Convert: 1,
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
      weaAtk_Patk_Convert: 1,
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
      weaAtk_Patk_Convert: 1,
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
      weaAtk_Patk_Convert: 1,
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
      weaAtk_Patk_Convert: 1,
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
      weaAtk_Patk_Convert: 1,
    },
    KNUCKLE: {
      baseHit: 0.1,
      baseAspd: 120,
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
          aspdT: 0.1,
        },
      },
      weaAtk_Matk_Convert: 0.5,
      weaAtk_Patk_Convert: 1,
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
      weaAtk_Patk_Convert: 1,
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
      weaAtk_Patk_Convert: 1,
    },
  };

  // 自由数值：玩家可定义基础值和加成项的，不由其他数值转化而来，但是会参与衍生属性计算的数值
  _lv: number;
  mainWeapon: {
    type: MainWeaType;
    _baseAtk: modifiers;
    baseAtk: number;
    refinement: number;
    stability: number;
  };
  subWeapon: {
    type: SubWeaType;
    _baseAtk: modifiers;
    baseAtk: number;
    refinement: number;
    stability: number;
  };
  bodyArmor: {
    type: BodyArmorType;
    _baseDef: modifiers;
    baseDef: number;
    refinement: number;
  };
  _str: modifiers;
  _int: modifiers;
  _vit: modifiers;
  _agi: modifiers;
  _dex: modifiers;
  _luk: modifiers;
  _cri: modifiers;
  _tec: modifiers;
  _men: modifiers;
  // 系统数值：由系统决定基础值，加成项由自由数值决定的
  _pPie: modifiers;
  _mPie: modifiers;
  _pStab: modifiers;
  _nDis: modifiers;
  _fDis: modifiers;
  _crT: modifiers;
  _cdT: modifiers;
  _weaPatkT: modifiers;
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
    this.mainWeapon = {
      type: mainWeaponType,
      _baseAtk: {
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
      baseAtk: 0,
      refinement: character.equipmentList?.mainWeapon?.refinement ?? 0,
      stability: character.equipmentList?.mainWeapon?.stability ?? 0,
    };
    this.subWeapon = {
      type: subWeaponType,
      _baseAtk: {
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
      baseAtk: 0,
      refinement: character.equipmentList?.subWeapon?.refinement ?? 0,
      stability: character.equipmentList?.subWeapon?.stability ?? 0,
    };
    this.bodyArmor = {
      type: bodyArmorType,
      _baseDef: {
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
      baseDef: 0,
      refinement: character.equipmentList?.bodyArmor?.refinement ?? 0,
    };
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
                  CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.stabT * dynamicTotalValue(this._str) +
                    CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.stabT *
                      dynamicTotalValue(this._int) +
                    CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.stabT *
                      dynamicTotalValue(this._agi) +
                    CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.stabT * dynamicTotalValue(this._dex),
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
    this._weaPatkT = {
      baseValue: CharacterClass.weaponAbiT[mainWeaponType].weaAtk_Patk_Convert,
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
      baseValue: Math.floor(93 + this._lv * (127 / 17 + dynamicTotalValue(this._vit) / 3)),
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
      baseValue: Math.floor(99 + this._lv + dynamicTotalValue(this._int) / 10 + dynamicTotalValue(this._tec)),
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
      baseValue: 25 + dynamicTotalValue(this._cri) / 5,
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
          Math.max(dynamicTotalValue(this._str) / 5, dynamicTotalValue(this._str) + dynamicTotalValue(this._agi)) / 10,
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
      baseValue: Math.floor(dynamicTotalValue(this.mainWeapon._baseAtk)),
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
    this._subWeaponAtk = {
      baseValue: dynamicTotalValue(this.subWeapon._baseAtk),
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
        this._lv +
        dynamicTotalValue(this._mainWeaponAtk) +
        CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.pAtkT * dynamicTotalValue(this._str) +
        CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.pAtkT * dynamicTotalValue(this._int) +
        CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.pAtkT * dynamicTotalValue(this._agi) +
        CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.pAtkT * dynamicTotalValue(this._dex),
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
        this._lv +
        dynamicTotalValue(this._weaMatkT) * dynamicTotalValue(this._mainWeaponAtk) +
        CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.mAtkT * dynamicTotalValue(this._str) +
        CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.mAtkT * dynamicTotalValue(this._int) +
        CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.mAtkT * dynamicTotalValue(this._agi) +
        CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.mAtkT * dynamicTotalValue(this._dex),
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
        this._lv +
        CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.aspdT * dynamicTotalValue(this._str) +
        CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.aspdT * dynamicTotalValue(this._int) +
        CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.aspdT * dynamicTotalValue(this._agi) +
        CharacterClass.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.aspdT * dynamicTotalValue(this._dex),
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
      baseValue: dynamicTotalValue(this._dex) * 2.94 + dynamicTotalValue(this._agi) * 1.16,
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
      baseValue: dynamicTotalValue(this._maxHP),
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
      baseValue: dynamicTotalValue(this._maxMP),
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
      baseValue: 10 + dynamicTotalValue(this._maxMP) / 10,
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
}

export class MonsterClass {
  _name: string;
  _lv: number;
  _hp: modifiers;
  _pDef: modifiers;
  _pRes: modifiers;
  _mDef: modifiers;
  _mRes: modifiers;
  _cRes: modifiers;
  constructor(monster: Monster) {
    this._name = monster.name;
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
  }

  public inherit = (otherMonsterClass: MonsterClass) => {
    const copy = JSON.parse(JSON.stringify(otherMonsterClass)) as MonsterClass;
    Object.assign(this, copy);
  };
}

export class SkillClass {
  _name: string;
  _lv: number;
  _am: modifiers;
  _cm: modifiers;
  constructor(skill: tSkill, character: CharacterClass, monster: MonsterClass) {
    const c = character;
    const m = monster;
    this._name = skill.name;
    this._lv = skill.level ?? 0;
    this._am = {
      get baseValue() {
        return dynamicTotalValue(c._am);
      },
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
      get baseValue() {
        return dynamicTotalValue(c._cm);
      },
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
}

export const computeFrameData = (skillSequence: tSkill[], character: Character, monster: Monster) => {
  const frameDatas: computerArgType[] = [];
  let skillIndex = 0;
  let skillFrame = 0;
  let skillTotalFrame = 0;
  let eventSequence: eventSequenceType[] = [];
  let tempComputeArg = {};
  let computeArg: computerArgType;
  const tempCharacterClass = new CharacterClass(character);
  const tempMonsterClass = new MonsterClass(monster);

  // 设置上限20分钟 = 60 * 60 * 20
  for (let frame = 0; frame < 72000; frame++) {
    // debugger;
    // 每帧需要做的事
    frame !== 0 && skillFrame++;
    const characterAttr = new CharacterClass(character);
    const monsterAttr = new MonsterClass(monster);
    const currentSkill = skillSequence[skillIndex]!;

    // 读取上一帧的数据
    characterAttr.inherit(tempCharacterClass);
    monsterAttr.inherit(tempMonsterClass);
    const skillAttr = new SkillClass(currentSkill, characterAttr, monsterAttr);

    // 定义计算上下文
    computeArg = {
      p: {
        get lv() {
          return characterAttr._lv;
        },
        get str() {
          return dynamicTotalValue(characterAttr._str);
        },
        get int() {
          return dynamicTotalValue(characterAttr._int);
        },
        get vit() {
          return dynamicTotalValue(characterAttr._vit);
        },
        get dex() {
          return dynamicTotalValue(characterAttr._dex);
        },
        get agi() {
          return dynamicTotalValue(characterAttr._agi);
        },
        get luk() {
          return dynamicTotalValue(characterAttr._luk);
        },
        get tec() {
          return dynamicTotalValue(characterAttr._tec);
        },
        get cri() {
          return dynamicTotalValue(characterAttr._cri);
        },
        get men() {
          return dynamicTotalValue(characterAttr._men);
        },
        get mainWeaponType() {
          return characterAttr.mainWeapon.type;
        },
        get mainWeaponBaseAtk() {
          return dynamicTotalValue(characterAttr.mainWeapon._baseAtk);
        },
        get mainWeaponRefinement() {
          return characterAttr.mainWeapon.refinement;
        },
        get mainWeaponStability() {
          return characterAttr.mainWeapon.stability;
        },
        get subWeaponType() {
          return characterAttr.subWeapon.type;
        },
        get subWeaponBaseAtk() {
          return dynamicTotalValue(characterAttr.subWeapon._baseAtk);
        },
        get subWeaponRefinement() {
          return characterAttr.subWeapon.refinement;
        },
        get subWeaponStability() {
          return characterAttr.subWeapon.stability;
        },
        get bodyArmorType() {
          return characterAttr.bodyArmor.type;
        },
        get bodyArmorBaseDef() {
          return dynamicTotalValue(characterAttr.bodyArmor._baseDef);
        },
        get bodyArmorRefinement() {
          return characterAttr.bodyArmor.refinement;
        },
        get pPie() {
          return dynamicTotalValue(characterAttr._pPie);
        },
        get mPie() {
          return dynamicTotalValue(characterAttr._mPie);
        },
        get pStab() {
          return dynamicTotalValue(characterAttr._pStab);
        },
        get nDis() {
          return dynamicTotalValue(characterAttr._nDis);
        },
        get fDis() {
          return dynamicTotalValue(characterAttr._fDis);
        },
        get crT() {
          return dynamicTotalValue(characterAttr._crT);
        },
        get cdT() {
          return dynamicTotalValue(characterAttr._cdT);
        },
        get weaMatkT() {
          return dynamicTotalValue(characterAttr._weaMatkT);
        },
        get stro() {
          return dynamicTotalValue(characterAttr._stro);
        },
        get unsheatheAtk() {
          return dynamicTotalValue(characterAttr._unsheatheAtk);
        },
        get total() {
          return dynamicTotalValue(characterAttr._total);
        },
        get final() {
          return dynamicTotalValue(characterAttr._final);
        },
        get am() {
          return dynamicTotalValue(characterAttr._am);
        },
        get cm() {
          return dynamicTotalValue(characterAttr._cm);
        },
        get aggro() {
          return dynamicTotalValue(characterAttr._aggro);
        },
        get maxHP() {
          return dynamicTotalValue(characterAttr._maxHP);
        },
        get maxMP() {
          return dynamicTotalValue(characterAttr._maxMP);
        },
        get pCr() {
          return dynamicTotalValue(characterAttr._pCr);
        },
        get pCd() {
          return dynamicTotalValue(characterAttr._pCd);
        },
        get mainWeaponAtk() {
          return dynamicTotalValue(characterAttr._mainWeaponAtk);
        },
        get subWeaponAtk() {
          return dynamicTotalValue(characterAttr._subWeaponAtk);
        },
        get totalWeaponAtk() {
          return dynamicTotalValue(characterAttr._totalWeaponAtk);
        },
        get pAtk() {
          return dynamicTotalValue(characterAttr._pAtk);
        },
        get mAtk() {
          return dynamicTotalValue(characterAttr._mAtk);
        },
        get aspd() {
          return dynamicTotalValue(characterAttr._aspd);
        },
        get cspd() {
          return dynamicTotalValue(characterAttr._cspd);
        },
        get hp() {
          return dynamicTotalValue(characterAttr._hp);
        },
        get mp() {
          return dynamicTotalValue(characterAttr._mp);
        },
        get ampr() {
          return dynamicTotalValue(characterAttr._ampr);
        },
      },
      m: {
        get name() {
          return monsterAttr._name;
        },
        get lv() {
          return monsterAttr._lv;
        },
        get hp() {
          return dynamicTotalValue(monsterAttr._hp);
        },
        get pDef() {
          return dynamicTotalValue(monsterAttr._pDef);
        },
        get mDef() {
          return dynamicTotalValue(monsterAttr._mDef);
        },
        get pRes() {
          return dynamicTotalValue(monsterAttr._pRes);
        },
        get mRes() {
          return dynamicTotalValue(monsterAttr._mRes);
        },
        get cRes() {
          return dynamicTotalValue(monsterAttr._cRes);
        },
      },
      s: {
        get name() {
          return skillAttr._name;
        },
        get lv() {
          return skillAttr._lv;
        },
        get am() {
          return dynamicTotalValue(skillAttr._am);
        },
        get cm() {
          return dynamicTotalValue(skillAttr._cm);
        },
      },
      get frame() {
        return frame;
      },
      get skillIdex() {
        return skillIndex;
      },
      get skillFrame() {
        return skillFrame;
      },
      get vMatk() {
        return (
          ((dynamicTotalValue(characterAttr._mAtk) + characterAttr._lv - monsterAttr._lv) *
            (100 - dynamicTotalValue(monsterAttr._mRes))) /
            100 -
          ((100 - dynamicTotalValue(characterAttr._pPie)) / 100) * dynamicTotalValue(monsterAttr._pDef)
        );
      },
      get vPatk() {
        return (
          ((dynamicTotalValue(characterAttr._pAtk) + characterAttr._lv - monsterAttr._lv) *
            (100 - dynamicTotalValue(monsterAttr._pRes))) /
            100 -
          ((100 - dynamicTotalValue(characterAttr._mPie)) / 100) * dynamicTotalValue(monsterAttr._mDef)
        );
      },
    };

    // 合并上一帧的计算结果
    computeArg = _.merge(tempComputeArg, computeArg);

    // 封装当前状态的公式计算方法
    const evaluate = (formula: string) => {
      // console.log(formula, computeArg);
      return math.evaluate(formula, { ...computeArg }) as number | void;
    };

    monsterAttr._hp.modifiers.dynamic.fixed.push({
      value: -5000,
      origin: "测试阶段系统自动减损" + frame,
    });

    // 检查怪物死亡
    if (computeArg.m.hp <= 0) {
      console.log("怪物死亡");
      break;
    }

    // 执行并更新事件队列
    const nextEventSequence: eventSequenceType[] = [];
    // console.log("当前帧：", frame, "事件队列：", eventSequence);
    eventSequence.forEach((event, index) => {
      // console.log(
      //   "当前帧：",
      //   frame,
      //   "事件队列：",
      //   eventSequence,
      //   "第" + index + "个事件来源：" + event.origin,
      //   "类型为：",
      //   event.type,
      //   "条件：",
      //   event.condition,
      // );
      if (evaluate(event.condition)) {
        // 执行当前帧需要做的事
        console.log("条件成立，执行：" + event.behavior);
        const node = math.parse(event.behavior);
        const nodeString = node.toString();
        switch (node.type) {
          case "AssignmentNode":
            {
              const attr = nodeString.substring(0, nodeString.indexOf("=")).trim();
              const formula = nodeString.substring(nodeString.indexOf("=") + 1, nodeString.length).trim();
              console.log("发现赋值节点：" + nodeString);
              console.log("赋值对象：", attr);
              console.log("值表达式结果：", evaluate(formula));
              _.set(computeArg, attr, evaluate(formula));
            }

            break;

          default:
            {
              console.log("非赋值表达式：" + nodeString + " 判定为：" + node.type);
              // 非赋值表达式说明该行为是对当前战斗环境已有属性进行增减,从第一个加减号开始分解表达式
              const match = event.behavior.match(/(.+?)([+\-])(.+)/);
              if (match) {
                const targetStr = _.trim(match[1]);
                const operatorStr = match[2];
                const formulaStr = _.trim(match[3]);
                // 如果能够发现加减乘除运算符，则对符号左右侧字符串进行验证
                console.log("表达式拆解为：1:[" + targetStr + "]   2:[" + operatorStr + "]   3:[" + formulaStr + "]");
                // 查找对应对象的内部属性值
                const targetStrSplit = targetStr.split(".");
                if (targetStrSplit.length > 1) {
                  switch (targetStrSplit[0]) {
                    case "p":
                      {
                        let finalPath = "";
                        targetStrSplit.forEach((item, index) => {
                          if (index !== 0) {
                            const tempPath = index === targetStrSplit.length - 1 ? "_" + item : item + ".";
                            finalPath = finalPath + tempPath;
                          }
                        });
                        let target: modifiers | number | undefined;
                        if (_.get(characterAttr, finalPath)) {
                          console.log("最终路径：", "characterAttr." + finalPath);
                          // 如果在characterAttr找到了对应的属性
                          target = _.get(characterAttr, finalPath) as modifiers;
                          console.log("依据最终路径，在characterAttr中找到了：", target);
                          // 先判断值类型，依据字符串结尾是否具有百分比符号分为百分比加成和常数加成
                          const perMatch = formulaStr.match(/^([\s\S]+?)\s*(%?)$/);
                          if (perMatch) {
                            // 表达式非空时
                            if (perMatch[2] === "%") {
                              // 当末尾存在百分比符号时，尝试将计算结果添加进百分比数组中
                              console.log("表达式值为百分比类型，非百分号部分：", perMatch[1]);
                              if (perMatch[1]) {
                                // 尝试计算表达式结果
                                const result = evaluate(perMatch[1]);
                                if (result) {
                                  // 表达能够正确计算的话
                                  console.log("第3部分计算结果", result);
                                  // 根据运算符类型，将计算结果添加进百分比数组中
                                  if (operatorStr === "+") {
                                    target.modifiers.dynamic.percentage.push({
                                      value: result,
                                      origin: event.origin,
                                    });
                                  } else if (operatorStr === "-") {
                                    target.modifiers.dynamic.percentage.push({
                                      value: -result,
                                      origin: event.origin,
                                    });
                                  } else {
                                    console.log("未知运算符");
                                  }
                                } else {
                                  // 表达式计算结果为空时
                                  console.log("第3部分没有返回值");
                                }
                              }
                            } else {
                              // 否则，尝试将计算结果添加进常数值数组中
                              const result = evaluate(formulaStr);
                              if (result) {
                                // 表达能够正确计算的话
                                console.log("第3部分计算结果", result);
                                // 根据运算符类型，将计算结果添加进百分比数组中
                                if (operatorStr === "+") {
                                  target.modifiers.dynamic.fixed.push({
                                    value: result,
                                    origin: event.origin,
                                  });
                                } else if (operatorStr === "-") {
                                  target.modifiers.dynamic.fixed.push({
                                    value: -result,
                                    origin: event.origin,
                                  });
                                } else {
                                  console.log("未知运算符");
                                }
                              } else {
                                // 表达式计算结果为空时
                                console.log("第3部分没有返回值");
                              }
                            }
                          } else {
                            console.log("第3部分为空");
                          }
                          console.log("修改后的属性值为：", target);
                        } else if (_.get(computeArg, targetStr) !== undefined) {
                          console.log("最终路径：", "computeArg." + targetStr);
                          // 如果在计算上下文中寻找了对应的自定属性
                          target = _.get(computeArg, targetStr) as number;
                          console.log("依据最终路径，在computeArg中找到了：", target);
                          // 先判断值类型，依据字符串结尾是否具有百分比符号分为百分比加成和常数加成
                          const perMatch = formulaStr.match(/^([\s\S]+?)\s*(%?)$/);
                          if (perMatch) {
                            if (perMatch[2] === "%") {
                              // 当末尾存在百分比符号时，尝试更新属性
                              console.log("表达式值为百分比类型，非百分号部分：", perMatch[1]);
                              if (perMatch[1]) {
                                // 尝试计算表达式结果
                                const result = evaluate(perMatch[1]);
                                if (result) {
                                  // 表达能够正确计算的话
                                  console.log("表达式值计算结果", result);
                                  // 根据运算符类型，更新属性
                                  if (operatorStr === "+") {
                                    target += (target * result) / 100;
                                  } else if (operatorStr === "-") {
                                    target -= (target * result) / 100;
                                  } else {
                                    console.log("未知运算符");
                                  }
                                } else {
                                  // 表达式计算结果为空时
                                  console.log("表达式值没有返回值");
                                }
                              }
                            } else {
                              console.log("表达式值为常数类型，常数部分：", perMatch[1]);
                              // 否则，尝试更新属性
                              const result = evaluate(formulaStr);
                              if (result) {
                                // 表达能够正确计算的话
                                console.log("表达式值计算结果", result);
                                // 根据运算符类型，更新对应属性
                                if (operatorStr === "+") {
                                  target += result;
                                } else if (operatorStr === "-") {
                                  target -= result;
                                } else {
                                  console.log("未知运算符");
                                }
                              } else {
                                // 表达式计算结果为空时
                                console.log("表达式值没有返回值");
                              }
                            }
                          }
                          _.set(computeArg, targetStr, target);
                          console.log("修改后的属性值为：", target);
                        } else {
                          console.log("在计算上下文中没有找到对应的自定义属性:" + targetStr);
                        }
                      }
                      break;

                    case "m":
                      break;

                    case "s":

                    default:
                      break;
                  }
                }
              } else {
                // 如果未匹配到，则返回空字符串或其他你希望的默认值
                console.log("在：" + event.behavior + "中没有匹配到内容");
              }
            }
            break;
        }
        console.log("----------结果：", computeArg);
        // 不论是否已执行，将持续型事件加入后续队列
        event.type === "PersistentEffect" && nextEventSequence.push(event);
      } else {
        // console.log("条件不成立，将事件：", event, "放入后续队列");
        // 条件不成立，则放入后续队列
        event.type === "ImmediateEffect" && nextEventSequence.push(event);
        // 不论是否已执行，将持续型事件加入后续队列
        event.type === "PersistentEffect" && nextEventSequence.push(event);
      }
      // console.log("----------后续队列：", nextEventSequence);
    });

    // 当前技能执行完毕时
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
      console.log("执行到技能：" + newSkill.name);

      // 判断是否具备发动条件
      newSkill.skillEffect.skillCost.map((cost) => {
        // console.log(cost.costFormula);
        // const node = math.parse(cost.costFormula);
        // node.traverse(function (node) {
        //   switch (node.type) {
        //     case "OperatorNode":
        //       console.log(node.type, node.toString());
        //       break;
        //     case "ConstantNode":
        //       console.log(node.type, node.toString());
        //       break;
        //     case "SymbolNode":
        //       console.log(node.type, node.toString());
        //       break;
        //     default:
        //       console.log(node.type, node.toString());
        //   }
        // });
      });

      // 发送结果
      // postMessage({
      //   data: {
      //     type: "success",
      //     data: newSkill.name,
      //   },
      // } satisfies analyzeWorkerOutput);

      // 动态计算当前动作加速和咏唱加速
      const currentAm = math.min(50, math.max(0, computeArg.s.am));
      const currentCm = math.min(50, math.max(0, computeArg.s.cm));
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
      const cDurationBaseValue = evaluate(newSkill.skillEffect.chantingBaseDurationFormula) as number;
      // console.log("咏唱固定时长（秒）：" + cDurationBaseValue);
      // 可加速咏唱时长
      const cDurationModifiableValue = evaluate(newSkill.skillEffect.chantingModifiableDurationFormula) as number;
      // console.log("咏唱可加速时长（秒）：" + cDurationModifiableValue);
      // 实际咏唱时长
      const cDurationActualValue = cDurationBaseValue + (cDurationModifiableValue * (100 - currentCm)) / 100;
      // console.log("当前咏唱缩减" + currentCm + "%，咏唱实际时长（秒）：" + cDurationActualValue);
      skillTotalFrame = math.floor(aDurationActualValue + cDurationActualValue * 60);
      // console.log("技能总时长（帧）：" + skillTotalFrame);

      // 计算技能前摇
      let skillWindUp = 100000000;
      // 判断前摇计算公式是否包含百分比符号，未注明前摇时长的技能效果都默认在技能动画完全执行完毕后生效
      const perMatch = newSkill.skillEffect.skillWindUpFormula?.match(/^([\s\S]+?)\s*(%?)$/);
      if (perMatch) {
        // 表达式非空时
        if (perMatch[2] === "%") {
          // 当末尾存在百分比符号时，转换未固定帧数
          // console.log("技能前摇表达式为百分比形式");
          if (perMatch[1]) {
            // 尝试计算表达式结果
            const result = evaluate(perMatch[1]);
            if (result) {
              // console.log("前摇百分比表达式计算结果", result);
              skillWindUp = math.floor((skillTotalFrame * result) / 100);
            } else {
              // console.log("前摇百分比表达式计算结果为空，默认为技能总时长：" + skillTotalFrame + "帧");
              skillWindUp = skillTotalFrame;
            }
          }
        } else {
          // 否则，尝试将计算结果添加进常数值数组中
          if (perMatch[1]) {
            const result = evaluate(perMatch[1]);
            if (result) {
              // console.log("前摇常数表达式计算结果", result);
              skillWindUp = math.floor(result);
            } else {
              // console.log("前摇常数表达式计算结果为空，默认为技能总时长：" + skillTotalFrame + "帧");
              skillWindUp = skillTotalFrame;
            }
          } else {
            console.log("perMatch[1]为空");
          }
        }
      } else {
        console.log("未注明前摇值，默认为技能总时长：" + skillTotalFrame + "帧");
      }

      // 依据技能效果向事件队列添加事件
      newSkill.skillEffect.skillYield.forEach((yield_) => {
        let baseCondition = yield_.mutationTimingFormula;
        if (yield_.mutationTimingFormula === "null" || !yield_.mutationTimingFormula) {
          baseCondition = "true";
        }
        nextEventSequence.push(
          _.cloneDeep({
            type: yield_.yieldType,
            behavior: yield_.yieldFormula,
            condition: "frame > " + (frame + skillWindUp) + " and " + baseCondition,
            origin: newSkill.name,
            registrationFrame: frame,
          }),
        );
        console.log(
          "已添加技能：" + newSkill.name + "的技能效果：" + yield_.yieldFormula,
          "事件队列：",
          nextEventSequence,
        );
      });
    }

    frameDatas.push(_.cloneDeep(computeArg));
    // 将新序列赋值
    eventSequence = _.cloneDeep(nextEventSequence);
    // 将当前状态储存供下一帧使用
    tempComputeArg = computeArg;
    tempCharacterClass.inherit(characterAttr);
    tempMonsterClass.inherit(monsterAttr);
  }
  return frameDatas;
};

self.onmessage = (e: MessageEvent<analyzeWorkerInput>) => {
  switch (e.data.type) {
    case "start":
      {
        // 接收消息
        if (e.data.arg) {
          const { skillSequence, character, monster } = e.data.arg;
          // 执行计算
          const result = computeFrameData(skillSequence, character, monster);
          // 发送结果
          self.postMessage({
            type: "success",
            computeResult: result,
          } satisfies analyzeWorkerOutput);
        }
      }

      break;
    case "stop":
      {
        console.log("收到停止消息");
      }
      break;

    default:
      {
        // Handle any cases that are not explicitly mentioned
        console.error("Unhandled message type:", e);
      }
      break;
  }
};
