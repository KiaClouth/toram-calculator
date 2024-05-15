"use client";
import _ from "lodash-es";
import { type MainWeaType, type SubWeaType, type BodyArmorType, type $Enums } from "@prisma/client";
import * as math from "mathjs";
import { type Character } from "~/server/api/routers/character";
import { type Monster } from "~/server/api/routers/monster";
import { type SkillEffect } from "~/server/api/routers/skill";
import { type Modifier } from "~/server/api/routers/crystal";

const fps = 60;

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
  computeResult: SkillData[] | string;
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
  weaponAtk: number;
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
  index: number;
  frame: number;
  name: string;
  lv: number;
  am: number;
  cm: number;
};

export type computeArgType = {
  frame: number;
  p: pTpye;
  m: mType;
  s: sType;
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
  return math.floor(base * (1 + percentage / 100) + fixed);
};

export const characterModifierCollector = (
  character: Character,
): {
  origin: string;
  modifier: Modifier;
}[] => {
  // 类型谓词函数，用于检查对象是否符合目标类型
  function isTargetType(obj: unknown, currentPath: string[]): obj is Modifier {
    // 检查对象是否为目标类型
    const isModifier =
      typeof obj === "object" &&
      obj !== null &&
      "ModifierId" in obj &&
      "ModifierFormula" in obj &&
      typeof obj.ModifierId === "string" &&
      typeof obj.ModifierFormula === "string";
    console.log("当前路径：", currentPath.join("."), "正在检查属性：", obj, "是否符合Modifier类型，结论：", isModifier);
    return isModifier;
  }

  // 递归收集对象中所有符合目标类型的属性
  const result: { origin: string; modifier: Modifier }[] = [];

  function recurse(value: unknown, currentPath: string[]): void {
    if (isTargetType(value, currentPath)) {
      console.log("收集到一个符合条件的对象：", value, "当前路径：", currentPath.join("."));
      const name = currentPath.join(".");
      result.push({ origin: name, modifier: value });
    }

    if (_.isObject(value) && !_.isArray(value)) {
      _.forOwn(value, (subValue, key) => {
        recurse(subValue, [...currentPath, key]);
      });
    }

    if (_.isArray(value)) {
      value.forEach((subValue, index) => {
        recurse(subValue, [...currentPath, index.toString()]);
      });
    }
  }

  recurse(character, []);
  return result;
};

// 角色属性应用
export const characterModifiersApplicator = (character: Character, characterData: CharacterData): void => {
  console.log("角色属性应用");
  const modifiersData = characterModifierCollector(character);
  console.log("已收集的角色属性：", modifiersData);
  modifiersData.forEach((modifierData) => {
    // 属性添加
    const node = math.parse(modifierData.modifier.ModifierFormula);
    const nodeString = node.toString();
    switch (node.type) {
      case "AssignmentNode":
        {
          console.log("发现赋值节点：" + nodeString + ", 角色属性不允许使用赋值，放弃此属性");
        }

        break;

      default:
        {
          console.log("非赋值表达式：" + nodeString + " 判定为：" + node.type);
          // 非赋值表达式说明该行为是对当前角色已有属性进行增减,从第一个加减号开始分解表达式
          const match = modifierData.modifier.ModifierFormula.match(/(.+?)([+\-])(.+)/);
          if (match) {
            const targetStr = _.trim(match[1]);
            const operatorStr = match[2];
            const formulaStr = _.trim(match[3]);
            // 如果能够发现加减运算符，则对符号左右侧字符串进行验证
            console.log("表达式拆解为：1:[" + targetStr + "]   2:[" + operatorStr + "]   3:[" + formulaStr + "]");
            // 查找对应对象的内部属性值
            const targetStrSplit = targetStr.split(".");
            if (targetStrSplit.length > 0) {
              {
                let finalPath = "";
                targetStrSplit.forEach((item, index) => {
                  const tempPath = index === targetStrSplit.length - 1 ? "_" + item : item + ".";
                  finalPath = finalPath + tempPath;
                });
                let target: modifiers | number | undefined;
                console.log("最终路径：", finalPath);
                if (_.get(characterData, finalPath)) {
                  // 如果在characterAttr找到了对应的属性
                  target = _.get(characterData, finalPath) as modifiers;
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
                        const result = math.evaluate(perMatch[1], { ...characterData }) as number;
                        if (result) {
                          // 表达能够正确计算的话
                          console.log("表达式计算结果", result);
                          // 根据运算符类型，将计算结果添加进百分比数组中
                          if (operatorStr === "+") {
                            target.modifiers.static.percentage.push({
                              value: result,
                              origin: modifierData.origin,
                            });
                          } else if (operatorStr === "-") {
                            target.modifiers.static.percentage.push({
                              value: -result,
                              origin: modifierData.origin,
                            });
                          } else {
                            console.log("未知运算符");
                          }
                        } else {
                          // 表达式计算结果为空时
                          console.log("表达式没有返回值");
                        }
                      }
                    } else {
                      // 否则，尝试将计算结果添加进常数值数组中
                      const result = math.evaluate(formulaStr, { ...characterData }) as number;
                      if (result) {
                        // 表达能够正确计算的话
                        console.log("表达式计算结果", result);
                        // 根据运算符类型，将计算结果添加进百分比数组中
                        if (operatorStr === "+") {
                          target.modifiers.static.fixed.push({
                            value: result,
                            origin: modifierData.origin,
                          });
                        } else if (operatorStr === "-") {
                          target.modifiers.static.fixed.push({
                            value: -result,
                            origin: modifierData.origin,
                          });
                        } else {
                          console.log("未知运算符");
                        }
                      } else {
                        // 表达式计算结果为空时
                        console.log("表达式没有返回值");
                      }
                    }
                  } else {
                    console.log("表达式为空");
                  }
                  console.log("修改后的属性值为：", target);
                } else {
                  console.log("在计算上下文中没有找到对应的自定义属性:" + targetStr);
                }
              }
            }
          } else {
            // 如果未匹配到，则返回空字符串或其他你希望的默认值
            console.log("在：" + modifierData.modifier.ModifierFormula + "中没有匹配到内容");
          }
        }
        break;
    }
  });
};

export class CharacterData {
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
  lv: number;
  mainWeapon: {
    type: MainWeaType;
    _baseAtk: modifiers;
    refinement: number;
    stability: number;
  };
  subWeapon: {
    type: SubWeaType;
    _baseAtk: modifiers;
    refinement: number;
    stability: number;
  };
  bodyArmor: {
    type: BodyArmorType;
    _baseDef: modifiers;
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
  _weaponAtk: modifiers;
  _pAtk: modifiers;
  _mAtk: modifiers;
  _aspd: modifiers;
  _cspd: modifiers;
  // 再衍生属性
  _ampr: modifiers;
  _hp: modifiers;
  _mp: modifiers;
  [key: string]: object | string | number;

  constructor(character: Character) {
    console.log("正在实例化CharacterData");
    const mainWeaponType = character.mainWeapon?.mainWeaType ?? "NO_WEAPOEN";
    const subWeaponType = character.subWeapon?.subWeaType ?? "NO_WEAPOEN";
    const bodyArmorType = character.bodyArmor?.bodyArmorType ?? "NORMAL";
    // 计算基础值

    this.lv = character.lv;
    this.mainWeapon = {
      type: mainWeaponType,
      _baseAtk: {
        baseValue: character.mainWeapon?.baseAtk ?? 0,
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
      refinement: character.mainWeapon?.refinement ?? 0,
      stability: character.mainWeapon?.stability ?? 0,
    };
    this.subWeapon = {
      type: subWeaponType,
      _baseAtk: {
        baseValue: character.subWeapon?.baseAtk ?? 0,
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
      refinement: character.subWeapon?.refinement ?? 0,
      stability: character.subWeapon?.stability ?? 0,
    };
    this.bodyArmor = {
      type: bodyArmorType,
      _baseDef: {
        baseValue: character.bodyArmor?.baseDef ?? 0,
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
      refinement: character.bodyArmor?.refinement ?? 0,
    };
    this._str = {
      baseValue: character.baseStr ?? 0,
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
      baseValue: character.baseInt ?? 0,
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
      baseValue: character.baseVit ?? 0,
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
      baseValue: character.baseAgi ?? 0,
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
      baseValue: character.baseDex ?? 0,
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
      baseValue: character.specialAbiType === "LUK" ? character.specialAbiValue ?? 0 : 0,
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
      baseValue: character.specialAbiType === "TEC" ? character.specialAbiValue ?? 0 : 0,
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
      baseValue: character.specialAbiType === "MEN" ? character.specialAbiValue ?? 0 : 0,
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
      baseValue: character.specialAbiType === "CRI" ? character.specialAbiValue ?? 0 : 0,
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
              value: character.mainWeapon?.stability ?? 0,
              origin: "mainWeapon.stability",
            },
            {
              value:
                math.floor(
                  CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.stabT * dynamicTotalValue(this._str) +
                    CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.stabT * dynamicTotalValue(this._int) +
                    CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.stabT * dynamicTotalValue(this._agi) +
                    CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.stabT * dynamicTotalValue(this._dex),
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
      baseValue: CharacterData.weaponAbiT[mainWeaponType].weaAtk_Patk_Convert,
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
      baseValue: CharacterData.weaponAbiT[mainWeaponType].weaAtk_Matk_Convert,
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
      baseValue: Math.floor(93 + this.lv * (127 / 17 + dynamicTotalValue(this._vit) / 3)),
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
      baseValue: Math.floor(99 + this.lv + dynamicTotalValue(this._int) / 10 + dynamicTotalValue(this._tec)),
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
    this._weaponAtk = {
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
        dynamicTotalValue(this._mainWeaponAtk) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.pAtkT * dynamicTotalValue(this._str) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.pAtkT * dynamicTotalValue(this._int) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.pAtkT * dynamicTotalValue(this._agi) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.pAtkT * dynamicTotalValue(this._dex),
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
        dynamicTotalValue(this._weaMatkT) * dynamicTotalValue(this._mainWeaponAtk) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.mAtkT * dynamicTotalValue(this._str) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.mAtkT * dynamicTotalValue(this._int) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.mAtkT * dynamicTotalValue(this._agi) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.mAtkT * dynamicTotalValue(this._dex),
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
        CharacterData.weaponAbiT[mainWeaponType].baseAspd +
        this.lv +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.aspdT * dynamicTotalValue(this._str) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.aspdT * dynamicTotalValue(this._int) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.aspdT * dynamicTotalValue(this._agi) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.aspdT * dynamicTotalValue(this._dex),
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
    characterModifiersApplicator(character, this);
    console.log("实例化完毕，this：", this);
  }

  // get str() {
  //   return dynamicTotalValue(this._str);
  // }
  // get int() {
  //   return dynamicTotalValue(this._int);
  // }
  // get vit() {
  //   return dynamicTotalValue(this._vit);
  // }
  // get dex() {
  //   return dynamicTotalValue(this._dex);
  // }
  // get agi() {
  //   return dynamicTotalValue(this._agi);
  // }
  // get luk() {
  //   return dynamicTotalValue(this._luk);
  // }
  // get tec() {
  //   return dynamicTotalValue(this._tec);
  // }
  // get cri() {
  //   return dynamicTotalValue(this._cri);
  // }
  // get men() {
  //   return dynamicTotalValue(this._men);
  // }
  // get mainWeaponType() {
  //   return this.mainWeapon.type;
  // }
  // get mainWeaponBaseAtk() {
  //   return dynamicTotalValue(this.mainWeapon._baseAtk);
  // }
  // get mainWeaponRefinement() {
  //   return this.mainWeapon.refinement;
  // }
  // get mainWeaponStability() {
  //   return this.mainWeapon.stability;
  // }
  // get subWeaponType() {
  //   return this.subWeapon.type;
  // }
  // get subWeaponBaseAtk() {
  //   return dynamicTotalValue(this.subWeapon._baseAtk);
  // }
  // get subWeaponRefinement() {
  //   return this.subWeapon.refinement;
  // }
  // get subWeaponStability() {
  //   return this.subWeapon.stability;
  // }
  // get bodyArmorType() {
  //   return this.bodyArmor.type;
  // }
  // get bodyArmorBaseDef() {
  //   return dynamicTotalValue(this.bodyArmor._baseDef);
  // }
  // get bodyArmorRefinement() {
  //   return this.bodyArmor.refinement;
  // }
  // get pPie() {
  //   return dynamicTotalValue(this._pPie);
  // }
  // get mPie() {
  //   return dynamicTotalValue(this._mPie);
  // }
  // get pStab() {
  //   return dynamicTotalValue(this._pStab);
  // }
  // get nDis() {
  //   return dynamicTotalValue(this._nDis);
  // }
  // get fDis() {
  //   return dynamicTotalValue(this._fDis);
  // }
  // get crT() {
  //   return dynamicTotalValue(this._crT);
  // }
  // get cdT() {
  //   return dynamicTotalValue(this._cdT);
  // }
  // get weaMatkT() {
  //   return dynamicTotalValue(this._weaMatkT);
  // }
  // get stro() {
  //   return dynamicTotalValue(this._stro);
  // }
  // get unsheatheAtk() {
  //   return dynamicTotalValue(this._unsheatheAtk);
  // }
  // get total() {
  //   return dynamicTotalValue(this._total);
  // }
  // get final() {
  //   return dynamicTotalValue(this._final);
  // }
  // get am() {
  //   return dynamicTotalValue(this._am);
  // }
  // get cm() {
  //   return dynamicTotalValue(this._cm);
  // }
  // get aggro() {
  //   return dynamicTotalValue(this._aggro);
  // }
  // get maxHP() {
  //   return dynamicTotalValue(this._maxHP);
  // }
  // get maxMP() {
  //   return dynamicTotalValue(this._maxMP);
  // }
  // get pCr() {
  //   return dynamicTotalValue(this._pCr);
  // }
  // get pCd() {
  //   return dynamicTotalValue(this._pCd);
  // }
  // get mainWeaponAtk() {
  //   return dynamicTotalValue(this._mainWeaponAtk);
  // }
  // get subWeaponAtk() {
  //   return dynamicTotalValue(this._subWeaponAtk);
  // }
  // get weaponAtk() {
  //   return dynamicTotalValue(this._weaponAtk);
  // }
  // get pAtk() {
  //   return dynamicTotalValue(this._pAtk);
  // }
  // get mAtk() {
  //   return dynamicTotalValue(this._mAtk);
  // }
  // get aspd() {
  //   return dynamicTotalValue(this._aspd);
  // }
  // get cspd() {
  //   return dynamicTotalValue(this._cspd);
  // }
  // get hp() {
  //   return dynamicTotalValue(this._hp);
  // }
  // get mp() {
  //   return dynamicTotalValue(this._mp);
  // }
  // get ampr() {
  //   return dynamicTotalValue(this._ampr);
  // }
}

export class MonsterData {
  name: string;
  lv: number;
  _hp: modifiers;
  _pDef: modifiers;
  _pRes: modifiers;
  _mDef: modifiers;
  _mRes: modifiers;
  _cRes: modifiers;
  [key: string]: object | string | number;
  constructor(monster: Monster) {
    this.name = monster.name;
    this.lv = monster.baseLv ?? 0;
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
}

type stateFrameData = {
  character: CharacterData;
  monster: MonsterData;
};

export class SkillData {
  index: number;
  passedFrames: number;
  name: string;
  lv: number;
  _am: modifiers;
  _cm: modifiers;
  actionFixedDurationFormula: string;
  actionModifiableDurationFormula: string;
  chantingFixedDurationFormula: string;
  chantingModifiableDurationFormula: string;
  _actionFixedDuration: modifiers;
  _actionModifiableDuration: modifiers;
  _chantingFixedDuration: modifiers;
  _chantingModifiableDuration: modifiers;
  skillActionFrames: number;
  skillChantingFrames: number;
  skillDuration: number;
  skillWindUp: number;
  stateFramesData: stateFrameData[];
  finalEventSequence: eventSequenceType[];
  [key: string]: object | string | number;
  constructor(
    Index: number,
    skill: tSkill,
    character: CharacterData,
    monster: MonsterData,
    computeArg: computeArgType,
    eventSequence: eventSequenceType[],
    passedFrames: number,
  ) {
    this.passedFrames = passedFrames;
    this.finalEventSequence = _.cloneDeep(eventSequence);
    // 计算技能前摇
    const skillWindUpComputer = (
      skillWindUpFormula: string | null,
      skillDuration: number,
      computeArg: computeArgType,
    ) => {
      if (!skillWindUpFormula) {
        console.log("未注明前摇值，默认为技能总时长：" + skillDuration + "帧");
        return skillDuration;
      }
      // 判断前摇计算公式是否包含百分比符号，未注明前摇时长的技能效果都默认在技能动画完全执行完毕后生效
      const perMatch = skillWindUpFormula.match(/^([\s\S]+?)\s*(%?)$/);
      if (perMatch) {
        // 表达式非空时
        if (perMatch[2] === "%") {
          // 当末尾存在百分比符号时，转换未固定帧数
          // console.log("技能前摇表达式为百分比形式");
          if (perMatch[1]) {
            // 尝试计算表达式结果
            const result = math.evaluate(perMatch[1], computeArg) as number;
            if (result) {
              // console.log("前摇百分比表达式计算结果", result);
              return math.floor((skillDuration * result) / 100);
            } else {
              // console.log("前摇百分比表达式计算结果为空，默认为技能总时长：" + skillTotalFrame + "帧");
              return skillDuration;
            }
          }
        } else {
          // 否则，尝试将计算结果添加进常数值数组中
          if (perMatch[1]) {
            const result = math.evaluate(perMatch[1], computeArg) as number;
            if (result) {
              // console.log("前摇常数表达式计算结果", result);
              return math.floor(result);
            } else {
              // console.log("前摇常数表达式计算结果为空，默认为技能总时长：" + skillTotalFrame + "帧");
              return skillDuration;
            }
          } else {
            console.log("perMatch[1]为空");
          }
        }
      } else {
        console.log("未注明前摇值，默认为技能总时长：" + skillDuration + "帧");
      }
      return skillDuration;
    };
    // 计算技能动作期间角色和怪物的状态数据
    const stateFrameComputer = (
      character: CharacterData,
      monster: MonsterData,
      computeArg: computeArgType,
      eventSequence: eventSequenceType[],
    ): stateFrameData[] => {
      const stateFrames: stateFrameData[] = [{ character, monster }];
      for (let frame = 0; frame < this.skillDuration; frame++) {
        computeArg.s.frame = frame;

        eventSequence = frameData(passedFrames + frame, character, monster, computeArg, eventSequence);
        stateFrames.push({
          character: _.cloneDeep(character),
          monster: _.cloneDeep(monster),
        });
      }
      this.finalEventSequence = eventSequence;
      return stateFrames;
    };
    Index++;
    this.index = Index;
    computeArg.s.index = this.index;
    this.name = skill.name;
    computeArg.s.name = this.name;
    this.lv = skill.level ?? 0;
    computeArg.s.lv = this.lv;
    this._am = {
      baseValue: dynamicTotalValue(character._am),
      modifiers: {
        static: {
          fixed: [
            {
              value: math.max(0, math.floor((dynamicTotalValue(character._cspd) - 1000) / 180)),
              origin: "角色攻速转化",
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
    computeArg.s.am = dynamicTotalValue(this._am);
    this._cm = {
      baseValue: dynamicTotalValue(character._cm),
      modifiers: {
        static: {
          fixed: [
            {
              value: math.min(
                50 + math.floor((dynamicTotalValue(character._cspd) - 1000) / 180),
                math.floor(dynamicTotalValue(character._cspd) / 20),
              ),
              origin: "角色咏速转化",
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
    computeArg.s.cm = dynamicTotalValue(this._cm);
    this.actionFixedDurationFormula = skill.skillEffect.actionBaseDurationFormula;
    this.actionModifiableDurationFormula = skill.skillEffect.actionModifiableDurationFormula;
    this.chantingFixedDurationFormula = skill.skillEffect.chantingBaseDurationFormula;
    this.chantingModifiableDurationFormula = skill.skillEffect.chantingModifiableDurationFormula;
    this._actionFixedDuration = {
      baseValue: math.evaluate(skill.skillEffect.actionBaseDurationFormula, computeArg) as number,
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
    this._actionModifiableDuration = {
      baseValue: math.evaluate(skill.skillEffect.actionModifiableDurationFormula, computeArg) as number,
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
    this._chantingFixedDuration = {
      baseValue: math.evaluate(skill.skillEffect.chantingBaseDurationFormula, computeArg) as number,
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
    this._chantingModifiableDuration = {
      baseValue: math.evaluate(skill.skillEffect.chantingModifiableDurationFormula, computeArg) as number,
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
    this.skillActionFrames = math.floor(
      dynamicTotalValue(this._actionFixedDuration) +
        (dynamicTotalValue(this._actionModifiableDuration) * (100 - math.min(dynamicTotalValue(this._am), 50))) / 100,
    );
    this.skillChantingFrames = math.floor(
      dynamicTotalValue(this._chantingFixedDuration) +
        (dynamicTotalValue(this._chantingModifiableDuration) * (100 - math.min(dynamicTotalValue(this._cm), 50))) / 100,
    );
    this.skillDuration = this.skillActionFrames + this.skillChantingFrames * fps;
    this.skillWindUp = skillWindUpComputer(skill.skillEffect.skillWindUpFormula, this.skillDuration, computeArg);
    console.log(
      "实例化SkillData，技能序号：" + this.index,
      "名称：" + this.name,
      "技能总帧数：" + this.skillDuration,
      "已经过帧数：" + passedFrames,
    );
    // 依据技能效果向事件队列添加事件，需要考虑技能前摇
    skill.skillEffect.skillYield.forEach((yield_) => {
      let baseCondition = yield_.mutationTimingFormula;
      if (yield_.mutationTimingFormula === "null" || !yield_.mutationTimingFormula) {
        baseCondition = "true";
      }
      eventSequence.push(
        _.cloneDeep({
          type: yield_.yieldType,
          behavior: yield_.yieldFormula,
          condition: "frame > " + (passedFrames + this.skillWindUp) + " and " + baseCondition,
          origin: skill.name,
          registrationFrame: passedFrames,
        }),
      );
      console.log(
        "已将" + skill.name + "的技能效果：" + yield_.yieldFormula,
        "添加到事件队列，当前队列为：",
        _.cloneDeep(eventSequence),
      );
    });

    // 计算与帧相关的技能效果参数
    this.stateFramesData = stateFrameComputer(character, monster, computeArg, eventSequence);
  }

  // get am() {
  //   return dynamicTotalValue(this._am);
  // }
  // get cm() {
  //   return dynamicTotalValue(this._cm);
  // }

  // get actionBaseDuration() {
  //   return math.evaluate(this.actionFixedDurationFormula, this.s) as number;
  // }

  // get actionModifiableDuration() {
  //   return math.evaluate(this.actionModifiableDurationFormula, this.s) as number;
  // }

  // get chantingBaseDuration() {
  //   return math.evaluate(this.chantingFixedDurationFormula, this.s) as number;
  // }

  // get chantingModifiableDuration() {
  //   return math.evaluate(this.chantingModifiableDurationFormula, this.s) as number;
  // }
}

const frameData = (
  frame: number,
  character: CharacterData,
  monster: MonsterData,
  computeArg: computeArgType,
  eventSequence: eventSequenceType[],
) => {
  // 发送结果
  self.postMessage({
    type: "progress",
    computeResult: "已完成:" + frame + "帧",
  } satisfies analyzeWorkerOutput);
  // 每帧需要做的事
  computeArg.frame = frame;
  // 封装当前状态的公式计算方法
  const evaluate = (formula: string) => {
    return math.evaluate(formula, { ...computeArg }) as number | void;
  };

  monster._hp.modifiers.dynamic.fixed.push({
    value: -5000,
    origin: "测试阶段系统自动减损" + frame,
  });

  // 检查怪物死亡
  if (computeArg.m.hp <= 0) {
    console.log("怪物死亡");
  }

  // 执行并更新事件队列
  console.log("执行事件过滤前，事件队列为：", eventSequence);
  eventSequence = eventSequence.filter((event, index) => {
    console.log("第 " + frame + " 帧的第 " + index + " 个事件：", event);
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
                      if (_.get(character, finalPath)) {
                        console.log("最终路径：", "characterAttr." + finalPath);
                        // 如果在characterAttr找到了对应的属性
                        target = _.get(character, finalPath) as modifiers;
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
      // console.log("----------结果：", computeArg);
      // 不论是否已执行，将持续型事件加入后续队列
      if (event.type === "PersistentEffect") {
        console.log("已执行的事件是持续型事件，保留此事件");
        return true;
      } else {
        console.log("已执行的事件是单次事件，过滤此事件");
        return false;
      }
    } else {
      console.log("条件不成立，将事件保留");
      // 条件不成立，则不分类型直接放入后续队列
      return true;
    }
  });
  console.log("执行事件过滤后，事件队列为：", eventSequence);
  return _.cloneDeep(eventSequence);
};

export const computeFrameData = (skillSequence: tSkill[], character: Character, monster: Monster) => {
  const characterData = new CharacterData(character);
  const monsterData = new MonsterData(monster);
  const computeArg: computeArgType = {
    frame: 0,
    p: {
      get lv() {
        return characterData.lv;
      },
      get str() {
        return dynamicTotalValue(characterData._str);
      },
      get int() {
        return dynamicTotalValue(characterData._int);
      },
      get vit() {
        return dynamicTotalValue(characterData._vit);
      },
      get dex() {
        return dynamicTotalValue(characterData._dex);
      },
      get agi() {
        return dynamicTotalValue(characterData._agi);
      },
      get luk() {
        return dynamicTotalValue(characterData._luk);
      },
      get tec() {
        return dynamicTotalValue(characterData._tec);
      },
      get cri() {
        return dynamicTotalValue(characterData._cri);
      },
      get men() {
        return dynamicTotalValue(characterData._men);
      },
      get mainWeaponType() {
        return characterData.mainWeapon.type;
      },
      get mainWeaponBaseAtk() {
        return dynamicTotalValue(characterData.mainWeapon._baseAtk);
      },
      get mainWeaponRefinement() {
        return characterData.mainWeapon.refinement;
      },
      get mainWeaponStability() {
        return characterData.mainWeapon.stability;
      },
      get subWeaponType() {
        return characterData.subWeapon.type;
      },
      get subWeaponBaseAtk() {
        return dynamicTotalValue(characterData.subWeapon._baseAtk);
      },
      get subWeaponRefinement() {
        return characterData.subWeapon.refinement;
      },
      get subWeaponStability() {
        return characterData.subWeapon.stability;
      },
      get bodyArmorType() {
        return characterData.bodyArmor.type;
      },
      get bodyArmorBaseDef() {
        return dynamicTotalValue(characterData.bodyArmor._baseDef);
      },
      get bodyArmorRefinement() {
        return characterData.bodyArmor.refinement;
      },
      get pPie() {
        return dynamicTotalValue(characterData._pPie);
      },
      get mPie() {
        return dynamicTotalValue(characterData._mPie);
      },
      get pStab() {
        return dynamicTotalValue(characterData._pStab);
      },
      get nDis() {
        return dynamicTotalValue(characterData._nDis);
      },
      get fDis() {
        return dynamicTotalValue(characterData._fDis);
      },
      get crT() {
        return dynamicTotalValue(characterData._crT);
      },
      get cdT() {
        return dynamicTotalValue(characterData._cdT);
      },
      get weaMatkT() {
        return dynamicTotalValue(characterData._weaMatkT);
      },
      get stro() {
        return dynamicTotalValue(characterData._stro);
      },
      get unsheatheAtk() {
        return dynamicTotalValue(characterData._unsheatheAtk);
      },
      get total() {
        return dynamicTotalValue(characterData._total);
      },
      get final() {
        return dynamicTotalValue(characterData._final);
      },
      get am() {
        return dynamicTotalValue(characterData._am);
      },
      get cm() {
        return dynamicTotalValue(characterData._cm);
      },
      get aggro() {
        return dynamicTotalValue(characterData._aggro);
      },
      get maxHP() {
        return dynamicTotalValue(characterData._maxHP);
      },
      get maxMP() {
        return dynamicTotalValue(characterData._maxMP);
      },
      get pCr() {
        return dynamicTotalValue(characterData._pCr);
      },
      get pCd() {
        return dynamicTotalValue(characterData._pCd);
      },
      get mainWeaponAtk() {
        return dynamicTotalValue(characterData._mainWeaponAtk);
      },
      get subWeaponAtk() {
        return dynamicTotalValue(characterData._subWeaponAtk);
      },
      get weaponAtk() {
        return dynamicTotalValue(characterData._weaponAtk);
      },
      get pAtk() {
        return dynamicTotalValue(characterData._pAtk);
      },
      get mAtk() {
        return dynamicTotalValue(characterData._mAtk);
      },
      get aspd() {
        return dynamicTotalValue(characterData._aspd);
      },
      get cspd() {
        return dynamicTotalValue(characterData._cspd);
      },
      get hp() {
        return dynamicTotalValue(characterData._hp);
      },
      get mp() {
        return dynamicTotalValue(characterData._mp);
      },
      get ampr() {
        return dynamicTotalValue(characterData._ampr);
      },
    },
    m: {
      get name() {
        return monster.name;
      },
      get lv() {
        return monsterData.lv;
      },
      get hp() {
        return dynamicTotalValue(monsterData._hp);
      },
      get pDef() {
        return dynamicTotalValue(monsterData._pDef);
      },
      get mDef() {
        return dynamicTotalValue(monsterData._mDef);
      },
      get pRes() {
        return dynamicTotalValue(monsterData._pRes);
      },
      get mRes() {
        return dynamicTotalValue(monsterData._mRes);
      },
      get cRes() {
        return dynamicTotalValue(monsterData._cRes);
      },
    },
    s: {
      index: 0,
      frame: 0,
      name: skillSequence[0]?.name ?? "",
      lv: skillSequence[0]?.level ?? 0,
      am: 0,
      cm: 0,
    },
    get vMatk() {
      return (
        ((dynamicTotalValue(characterData._mAtk) + characterData.lv - monsterData.lv) *
          (100 - dynamicTotalValue(monsterData._mRes))) /
          100 -
        ((100 - dynamicTotalValue(characterData._pPie)) / 100) * dynamicTotalValue(monsterData._pDef)
      );
    },
    get vPatk() {
      return (
        ((dynamicTotalValue(characterData._pAtk) + characterData.lv - monsterData.lv) *
          (100 - dynamicTotalValue(monsterData._pRes))) /
          100 -
        ((100 - dynamicTotalValue(characterData._mPie)) / 100) * dynamicTotalValue(monsterData._mDef)
      );
    },
  };
  let eventSequence: eventSequenceType[] = [];
  const result: SkillData[] = [];
  skillSequence.forEach((skill, index) => {
    let passedFrames = 0;
    result.forEach((skillData) => {
      passedFrames += skillData.skillDuration;
    });
    // console.log("当前已储存的结果：", _.cloneDeep(result));
    const newSkill = _.cloneDeep(
      new SkillData(index, skill, characterData, monsterData, computeArg, eventSequence, passedFrames),
    );
    eventSequence = newSkill.finalEventSequence;
    result.push(newSkill);
  });

  return result;
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
          console.log("计算结果：", result);
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
