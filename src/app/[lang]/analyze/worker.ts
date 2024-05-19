"use client";
import _, { clone, isNumber } from "lodash-es";
import { type MainWeaponType, type SubWeaponType, type BodyArmorType, type $Enums } from "@prisma/client";
import { type Character } from "~/server/api/routers/character";
import { type Monster } from "~/server/api/routers/monster";
import { type SkillEffect } from "~/server/api/routers/skill";
import { type ModifiersList } from "~/server/api/routers/crystal";
import { type getDictionary } from "~/app/get-dictionary";
import { type MathNode, all, create, floor, max, min, parse } from "mathjs";
import { defaultSkill } from "~/app/store";

const fps = 60;

export type analyzeWorkerInput = {
  type: "start" | "stop";
  arg?: {
    dictionary: ReturnType<typeof getDictionary>;
    skillSequence: tSkill[];
    character: Character;
    monster: Monster;
  };
};

export type analyzeWorkerOutput = {
  type: "progress" | "success" | "error";
  computeResult: SkillData[] | string;
};

export class modifiers {
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
  update: () => string;
  constructor() {
    this.baseValue = 0;
    this.modifiers = {
      static: {
        fixed: [],
        percentage: [],
      },
      dynamic: {
        fixed: [],
        percentage: [],
      },
    };
    this.update = () => {
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return "";
    };
  }
}

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
  mainWeaponType: MainWeaponType;
  mainWeaponBaseAtk: number;
  mainWeaponRefinement: number;
  mainWeaponStability: number;
  subWeaponType: SubWeaponType;
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
  maxHp: number;
  maxMp: number;
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
  vMatk: number;
  vPatk: number;
};

export type computeArgType = {
  frame: number;
  p: CharacterData;
  m: MonsterData;
  s?: SkillData;
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
  return floor(base * (1 + percentage / 100) + fixed);
};

// 随机种子设置
const randomSeed: null | string = null;
// 向math中添加自定义方法
// 验证 `all` 是否为有效的 FactoryFunctionMap 对象
if (!all) {
  throw new Error("all is undefined. Make sure you are importing it correctly.");
}

const math = create(all, {
  epsilon: 1e-12,
  matrix: "Matrix",
  number: "number",
  precision: 64,
  predictable: false,
  randomSeed: randomSeed,
});

// 导入自定义方法
// 此处需要考虑参数的上下文环境，静态加成的上下文环境为CharacterData，动态加成的上下文环境为computeArgType
math.import({
  dynamicTotalValue: dynamicTotalValue,
  // 应用于CharacterData环境的函数--------------------------------
  // 判断主武器类型是否为无
  isNO_WEAPON: function (mainWeapon: CharacterData["mainWeapon"]) {
    return mainWeapon.type === "NO_WEAPON";
  },
  // 判断主武器类型是否为单手剑
  isONE_HAND_SWORD: function (mainWeapon: CharacterData["mainWeapon"]) {
    return mainWeapon.type === "ONE_HAND_SWORD";
  },
  // 判断主武器类型是否为双手剑
  isTWO_HANDS_SWORD: function (mainWeapon: CharacterData["mainWeapon"]) {
    return mainWeapon.type === "TWO_HANDS_SWORD";
  },
  // 判断主武器类型是否为弓
  isBOW: function (mainWeapon: CharacterData["mainWeapon"]) {
    return mainWeapon.type === "BOW";
  },
  // 判断主武器类型是否为弩
  isBOWGUN: function (mainWeapon: CharacterData["mainWeapon"]) {
    return mainWeapon.type === "BOWGUN";
  },
  // 判断主武器类型是否为法杖
  isSTAFF: function (mainWeapon: CharacterData["mainWeapon"]) {
    return mainWeapon.type === "STAFF";
  },
  // 判断主武器类型是否为魔导具
  isMAGIC_DEVICE: function (mainWeapon: CharacterData["mainWeapon"]) {
    return mainWeapon.type === "MAGIC_DEVICE";
  },
  // 判断主武器类型是否为拳套
  isKNUCKLE: function (mainWeapon: CharacterData["mainWeapon"]) {
    return mainWeapon.type === "KNUCKLE";
  },
  // 判断主武器类型是否为旋风枪
  isHALBERD: function (mainWeapon: CharacterData["mainWeapon"]) {
    return mainWeapon.type === "HALBERD";
  },
  // 判断主武器类型是否为拔刀剑
  isKATANA: function (mainWeapon: CharacterData["mainWeapon"]) {
    return mainWeapon.type === "KATANA";
  },
  // 应用于SkillData环境的函数--------------------------------
});

// 角色加成项收集
export const characterModifierCollector = (character: Character): ModifiersList[] => {
  // 类型谓词函数，用于检查对象是否符合目标类型
  function isTargetType(obj: unknown, _currentPath: string[]): obj is ModifiersList {
    // 检查对象是否为目标类型
    const isModifiersList =
      typeof obj === "object" && obj !== null && "modifiers" in obj && typeof obj.modifiers === "object";
    // console.log(
    //   "当前路径：",
    //   _currentPath.join("."),
    //   "正在检查属性：",
    //   obj,
    //   "是否符合ModifiersList类型，结论：",
    //   isModifiersList,
    // );
    return isModifiersList;
  }

  // 递归收集对象中所有符合目标类型的属性
  const result: ModifiersList[] = [];

  function recurse(value: unknown, currentPath: string[]): void {
    if (isTargetType(value, currentPath)) {
      // console.log("收集到一个符合条件的对象：", value, "当前路径：", currentPath.join("."));
      result.push(value);
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
  const modifiersListArray = characterModifierCollector(character);
  console.log("已收集的角色属性：", modifiersListArray);
  modifiersListArray.forEach((modifiersListData) => {
    const origin = modifiersListData.name ?? "未知角色属性";
    modifiersListData.modifiers.forEach((modifier) => {
      // 属性添加
      const node = parse(modifier.formula);
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
            const match = modifier.formula.match(/(.+?)([+\-])(.+)/);
            if (match) {
              const targetStr = _.trim(match[1]);
              const operatorStr = match[2];
              const formulaStr = _.trim(match[3]);
              // 如果能够发现加减运算符，则对符号左右侧字符串进行验证
              console.log("表达式拆解为：1:[" + targetStr + "]   2:[" + operatorStr + "]   3:[" + formulaStr + "]");
              // 查找对应对象的内部属性值
              const targetStrSplit = targetStr.split(".");
              let finalPath = "";
              if (targetStrSplit.length > 1) {
                // 当前表达式有多层嵌套
                targetStrSplit.forEach((item, index) => {
                  const tempPath = index === targetStrSplit.length - 1 ? +item : item + ".";
                  finalPath = finalPath + tempPath;
                  console.log("拆解后的路径：", finalPath);
                });
              } else {
                finalPath = targetStr;
                console.log("拆解后的路径：", finalPath);
              }

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
                            origin: origin,
                          });
                        } else if (operatorStr === "-") {
                          target.modifiers.static.percentage.push({
                            value: -result,
                            origin: origin,
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
                          origin: origin,
                        });
                      } else if (operatorStr === "-") {
                        target.modifiers.static.fixed.push({
                          value: -result,
                          origin: origin,
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
                // 更新相关值
                console.log("将更新受影响的属性：" + target.update());
              } else {
                console.log("在计算上下文中没有找到对应的自定义属性:" + targetStr);
              }
            } else {
              // 如果未匹配到，则返回空字符串或其他你希望的默认值
              console.log("在：" + modifier.formula + "中没有匹配到内容");
            }
          }
          break;
      }
    });
  });
};

export class CharacterData {
  // 武器的能力值-属性转化率
  static weaponAbiT: Record<
    MainWeaponType,
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
    NO_WEAPON: {
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
    type: MainWeaponType;
    baseAtk: modifiers;
    refinement: number;
    stability: number;
  };
  subWeapon: {
    type: SubWeaponType;
    baseAtk: modifiers;
    refinement: number;
    stability: number;
  };
  bodyArmor: {
    type: BodyArmorType;
    baseDef: modifiers;
    refinement: number;
  };
  str: modifiers;
  int: modifiers;
  vit: modifiers;
  agi: modifiers;
  dex: modifiers;
  luk: modifiers;
  cri: modifiers;
  tec: modifiers;
  men: modifiers;
  // 系统数值：由系统决定基础值，加成项由自由数值决定的
  pPie: modifiers;
  mPie: modifiers;
  pStab: modifiers;
  nDis: modifiers;
  fDis: modifiers;
  crT: modifiers;
  cdT: modifiers;
  weaPatkT: modifiers;
  weaMatkT: modifiers;
  unsheatheAtk: modifiers;
  stro: modifiers;
  total: modifiers;
  final: modifiers;
  am: modifiers;
  cm: modifiers;
  aggro: modifiers;
  anticipate: modifiers; // 看穿
  // 衍生属性：基础值由自由数值决定，玩家只能定义加成项的
  maxHp: modifiers;
  maxMp: modifiers;
  pCr: modifiers;
  pCd: modifiers;
  mainWeaponAtk: modifiers;
  subWeaponAtk: modifiers;
  weaponAtk: modifiers;
  pAtk: modifiers;
  mAtk: modifiers;
  aspd: modifiers;
  cspd: modifiers;
  // 再衍生属性
  ampr: modifiers;
  hp: modifiers;
  mp: modifiers;
  [key: string]: object | string | number;

  constructor(dictionary: ReturnType<typeof getDictionary>, character: Character) {
    console.log("正在实例化CharacterData");
    const mainWeaponType = character.mainWeapon?.mainWeaponType ?? "NO_WEAPON";
    const subWeaponType = character.subWeapon?.subWeaponType ?? "NO_WEAPON";
    const bodyArmorType = character.bodyArmor?.bodyArmorType ?? "NORMAL";

    // 计算基础值
    this.lv = character.lv;

    this.mainWeapon = {
      type: mainWeaponType,
      baseAtk: new modifiers(),
      refinement: character.mainWeapon?.refinement ?? 0,
      stability: character.mainWeapon?.stability ?? 0,
    };
    this.mainWeapon.baseAtk.update = () => {
      this.mainWeapon.baseAtk.baseValue = character.mainWeapon?.baseAtk ?? 0;
      const relation: modifiers[] = [this.mainWeaponAtk];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.subWeapon = {
      type: subWeaponType,
      baseAtk: new modifiers(),
      refinement: character.subWeapon?.refinement ?? 0,
      stability: character.subWeapon?.stability ?? 0,
    };
    this.subWeapon.baseAtk.update = () => {
      this.subWeapon.baseAtk.baseValue = character.subWeapon?.baseAtk ?? 0;
      const relation: modifiers[] = [this.subWeaponAtk];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.bodyArmor = {
      type: bodyArmorType,
      baseDef: new modifiers(),
      refinement: character.bodyArmor?.refinement ?? 0,
    };
    this.bodyArmor.baseDef.update = () => {
      this.bodyArmor.baseDef.baseValue = character.bodyArmor?.baseDef ?? 0;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.str = new modifiers();
    this.str.update = () => {
      this.str.baseValue = character.baseStr ?? 0;
      const relation: modifiers[] = [this.pCd, this.pAtk, this.mAtk, this.pStab, this.aspd];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.int = new modifiers();
    this.int.update = () => {
      this.int.baseValue = character.baseInt ?? 0;
      const relation: modifiers[] = [this.maxMp, this.pAtk, this.mAtk, this.aspd, this.pStab];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.vit = new modifiers();
    this.vit.update = () => {
      this.vit.baseValue = character.baseVit ?? 0;
      const relation: modifiers[] = [this.maxHp];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.agi = new modifiers();
    this.agi.update = () => {
      this.agi.baseValue = character.baseAgi ?? 0;
      const relation: modifiers[] = [this.pAtk, this.mAtk, this.pStab, this.pCd, this.aspd, this.cspd];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.dex = new modifiers();
    this.dex.update = () => {
      this.dex.baseValue = character.baseDex ?? 0;
      const relation: modifiers[] = [this.pAtk, this.mAtk, this.pStab, this.aspd, this.cspd];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.luk = new modifiers();
    this.luk.update = () => {
      this.luk.baseValue = character.specialAbiType === "LUK" ? character.specialAbiValue ?? 0 : 0;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.tec = new modifiers();
    this.tec.update = () => {
      this.tec.baseValue = character.specialAbiType === "TEC" ? character.specialAbiValue ?? 0 : 0;
      const relation: modifiers[] = [this.maxMp];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.men = new modifiers();
    this.men.update = () => {
      this.men.baseValue = character.specialAbiType === "MEN" ? character.specialAbiValue ?? 0 : 0;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.cri = new modifiers();
    this.cri.update = () => {
      this.cri.baseValue = character.specialAbiType === "CRI" ? character.specialAbiValue ?? 0 : 0;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    // 二级属性
    this.weaponAtk = new modifiers();
    this.weaponAtk.update = () => {
      this.weaponAtk.baseValue = dynamicTotalValue(this.mainWeaponAtk) + dynamicTotalValue(this.subWeaponAtk);
      const relation: modifiers[] = [this.pAtk, this.mAtk];
      relation.map((r) => r.update());
      return [""].join(",");
    };
    this.pAtk = new modifiers();
    this.pAtk.update = () => {
      this.pAtk.baseValue =
        this.lv +
        dynamicTotalValue(this.weaponAtk) * dynamicTotalValue(this.weaPatkT) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.pAtkT * dynamicTotalValue(this.str) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.pAtkT * dynamicTotalValue(this.int) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.pAtkT * dynamicTotalValue(this.agi) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.pAtkT * dynamicTotalValue(this.dex);
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.mAtk = new modifiers();
    this.mAtk.update = () => {
      this.mAtk.baseValue =
        this.lv +
        dynamicTotalValue(this.weaponAtk) * dynamicTotalValue(this.weaMatkT) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.mAtkT * dynamicTotalValue(this.str) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.mAtkT * dynamicTotalValue(this.int) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.mAtkT * dynamicTotalValue(this.agi) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.mAtkT * dynamicTotalValue(this.dex);
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.aspd = new modifiers();
    this.aspd.update = () => {
      this.aspd.baseValue =
        CharacterData.weaponAbiT[mainWeaponType].baseAspd +
        this.lv +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.aspdT * dynamicTotalValue(this.str) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.aspdT * dynamicTotalValue(this.int) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.aspdT * dynamicTotalValue(this.agi) +
        CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.aspdT * dynamicTotalValue(this.dex);
      const relation: modifiers[] = [this.am];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.cspd = new modifiers();
    this.cspd.update = () => {
      this.cspd.baseValue = dynamicTotalValue(this.dex) * 2.94 + dynamicTotalValue(this.agi) * 1.16;
      const relation: modifiers[] = [this.cm];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.pCr = new modifiers();
    this.pCr.update = () => {
      this.pCr.baseValue = 25 + dynamicTotalValue(this.cri) / 5;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.pCd = new modifiers();
    this.pCd.update = () => {
      this.pCd.baseValue =
        150 +
        Math.floor(
          Math.max(dynamicTotalValue(this.str) / 5, dynamicTotalValue(this.str) + dynamicTotalValue(this.agi)) / 10,
        );
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.maxHp = new modifiers();
    this.maxHp.update = () => {
      this.maxHp.baseValue = Math.floor(93 + this.lv * (127 / 17 + dynamicTotalValue(this.vit) / 3));
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.maxMp = new modifiers();
    this.maxMp.update = () => {
      this.maxMp.baseValue = Math.floor(99 + this.lv + dynamicTotalValue(this.int) / 10 + dynamicTotalValue(this.tec));
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };
    this.mainWeaponAtk = new modifiers();
    this.mainWeaponAtk.update = () => {
      this.mainWeaponAtk.baseValue = dynamicTotalValue(this.mainWeapon.baseAtk);
      this.mainWeaponAtk.modifiers.static.fixed[0] = {
        value: this.mainWeapon.refinement,
        origin: dictionary.ui.analyze.dialogData.mainWeapon.refinement,
      };
      this.mainWeaponAtk.modifiers.static.percentage[0] = {
        value: Math.pow(this.mainWeapon.refinement, 2),
        origin: dictionary.ui.analyze.dialogData.mainWeapon.refinement,
      };
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.subWeaponAtk = new modifiers();
    this.subWeaponAtk.update = () => {
      this.subWeaponAtk.baseValue = dynamicTotalValue(this.subWeapon.baseAtk);
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    // 系统属性
    this.pPie = new modifiers();
    this.pPie.update = () => {
      this.pPie.baseValue = 0;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.mPie = new modifiers();
    this.mPie.update = () => {
      this.mPie.baseValue = 0;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.pStab = new modifiers();
    this.pStab.update = () => {
      this.pStab.baseValue = 0;
      this.pStab.modifiers.static.fixed[0] = {
        value: character.mainWeapon?.stability ?? 0,
        origin: dictionary.ui.analyze.dialogData.mainWeapon.stability,
      };
      this.pStab.modifiers.static.fixed[1] = {
        value:
          floor(
            CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.str.stabT * dynamicTotalValue(this.str) +
              CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.int.stabT * dynamicTotalValue(this.int) +
              CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.agi.stabT * dynamicTotalValue(this.agi) +
              CharacterData.weaponAbiT[mainWeaponType].abi_Attr_Convert.dex.stabT * dynamicTotalValue(this.dex),
          ) ?? 0,
        origin: [
          dictionary.ui.analyze.dialogData.str,
          dictionary.ui.analyze.dialogData.int,
          dictionary.ui.analyze.dialogData.agi,
          dictionary.ui.analyze.dialogData.dex,
        ].join(" + "),
      };
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.nDis = new modifiers();
    this.nDis.update = () => {
      this.nDis.baseValue = 100;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.fDis = new modifiers();
    this.fDis.update = () => {
      this.fDis.baseValue = 100;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.crT = new modifiers();
    this.crT.update = () => {
      this.crT.baseValue = 0;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.cdT = new modifiers();
    this.cdT.update = () => {
      this.cdT.baseValue = 50;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.stro = new modifiers();
    this.stro.update = () => {
      this.stro.baseValue = 100;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.unsheatheAtk = new modifiers();
    this.unsheatheAtk.update = () => {
      this.unsheatheAtk.baseValue = 100;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.total = new modifiers();
    this.total.update = () => {
      this.total.baseValue = 100;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.final = new modifiers();
    this.final.update = () => {
      this.final.baseValue = 100;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.anticipate = new modifiers();
    this.anticipate.update = () => {
      this.anticipate.baseValue = 0;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.weaMatkT = new modifiers();
    this.weaMatkT.update = () => {
      this.weaMatkT.baseValue = CharacterData.weaponAbiT[mainWeaponType].weaAtk_Matk_Convert;
      const relation: modifiers[] = [this.mAtk];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.weaPatkT = new modifiers();
    this.weaPatkT.update = () => {
      this.weaPatkT.baseValue = CharacterData.weaponAbiT[mainWeaponType].weaAtk_Patk_Convert;
      const relation: modifiers[] = [this.pAtk];
      relation.map((r) => r.update());
      return ["_pAtk"].join(",");
    };

    // 三级属性
    this.am = new modifiers();
    this.am.update = () => {
      this.am.baseValue = 0;
      this.am.modifiers.static.fixed[0] = {
        value: max(0, floor((dynamicTotalValue(this.aspd) - 1000) / 180)),
        origin: dictionary.ui.analyze.dialogData.aspd,
      };
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.cm = new modifiers();
    this.cm.update = () => {
      this.cm.baseValue = 0;
      this.cm.modifiers.static.fixed[0] = {
        value: min(50 + floor((dynamicTotalValue(this.cspd) - 1000) / 180), floor(dynamicTotalValue(this.cspd) / 20)),
        origin: dictionary.ui.analyze.dialogData.cspd,
      };
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.aggro = new modifiers();
    this.aggro.update = () => {
      this.aggro.baseValue = 100;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.ampr = new modifiers();
    this.ampr.update = () => {
      this.ampr.baseValue = 10 + dynamicTotalValue(this.maxMp) / 10;
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    // 状态记录
    this.hp = new modifiers();
    this.hp.update = () => {
      this.hp.baseValue = dynamicTotalValue(this.maxHp);
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    this.mp = new modifiers();
    this.mp.update = () => {
      this.mp.baseValue = dynamicTotalValue(this.maxMp);
      const relation: modifiers[] = [];
      relation.map((r) => r.update());
      return [""].join(",");
    };

    // 添加加成项
    characterModifiersApplicator(character, this);
    // 初始化
    this.weaPatkT.update();
    this.weaMatkT.update();
    this.mainWeapon.baseAtk.update();
    this.subWeapon.baseAtk.update();
    this.bodyArmor.baseDef.update();
    this.str.update();
    this.int.update();
    this.vit.update();
    this.agi.update();
    this.dex.update();
    this.luk.update();
    this.tec.update();
    this.men.update();
    this.cri.update();

    this.maxHp.update();
    this.maxMp.update();
    this.pCr.update();
    this.pCd.update();
    this.mainWeaponAtk.update();
    this.subWeaponAtk.update();
    this.weaponAtk.update();
    this.pAtk.update();
    this.mAtk.update();
    this.aspd.update();
    this.cspd.update();

    this.pPie.update();
    this.mPie.update();
    this.pStab.update();
    this.nDis.update();
    this.fDis.update();
    this.crT.update();
    this.cdT.update();
    this.stro.update();
    this.unsheatheAtk.update();
    this.total.update();
    this.final.update();

    this.am.update();
    this.cm.update();
    this.aggro.update();
    this.ampr.update();

    this.hp.update();
    this.mp.update();

    console.log("实例化完毕，this：", _.cloneDeep(this));
  }
}

export class MonsterData {
  name: string;
  lv: number;
  hp: modifiers;
  pDef: modifiers;
  pRes: modifiers;
  mDef: modifiers;
  mRes: modifiers;
  cRes: modifiers;
  [key: string]: object | string | number;
  constructor(monster: Monster) {
    this.name = monster.name;
    this.lv = monster.baseLv ?? 0;
    this.pDef = {
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
      update: () => "",
    };
    this.pRes = {
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
      update: () => "",
    };
    this.mDef = {
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
      update: () => "",
    };
    this.mRes = {
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
      update: () => "",
    };
    this.cRes = {
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
      update: () => "",
    };
    this.hp = {
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
      update: () => "",
    };
  }
}

type stateFrameData = {
  frame: number;
  character: CharacterData;
  monster: MonsterData;
};

export class SkillData {
  index: number;
  passedFrames: number;
  name: string;
  lv: number;
  am: modifiers;
  cm: modifiers;
  vMatk: modifiers;
  vPatk: modifiers;
  // actionFixedDurationFormula: string;
  // actionModifiableDurationFormula: string;
  // chantingFixedDurationFormula: string;
  // chantingModifiableDurationFormula: string;
  actionFixedDuration: modifiers;
  actionModifiableDuration: modifiers;
  chantingFixedDuration: modifiers;
  chantingModifiableDuration: modifiers;
  skillActionFrames: number;
  skillChantingFrames: number;
  skillDuration: number;
  skillWindUp: number;
  stateFramesData: stateFrameData[];
  finalEventSequence: eventSequenceType[];
  [key: string]: object | string | number;
  constructor(
    dictionary: ReturnType<typeof getDictionary>,
    Index: number,
    skill: tSkill,
    characterData: CharacterData,
    monsterData: MonsterData,
    computeArg: computeArgType,
    eventSequence: eventSequenceType[],
    passedFrames: number,
  ) {
    // 封装当前状态的公式计算方法
    const cEvaluate = (formula: string) => {
      // console.log("表达式为：", formula, "计算环境为：", JSON.parse(JSON.stringify(computeArg)))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return math.evaluate(formula, { ...JSON.parse(JSON.stringify(computeArg)) }) as number | void;
    };
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
      // 判断前摇计算公式是否包含百分比符号，未注明前摇时长的技能效果都默认在技能动画执行3/4后生效
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
              return floor((skillDuration * result) / 100);
            } else {
              // console.log("前摇百分比表达式计算结果为空，默认为技能总时长：" + skillTotalFrame * 3/4  + "帧");
              return floor((skillDuration * 3) / 4);
            }
          }
        } else {
          // 否则，尝试将计算结果添加进常数值数组中
          if (perMatch[1]) {
            const result = math.evaluate(perMatch[1], computeArg) as number;
            if (result) {
              // console.log("前摇常数表达式计算结果", result);
              return floor(result);
            } else {
              // console.log("前摇常数表达式计算结果为空，默认为技能总时长：" + skillTotalFrame *3/4 + "帧");
              return floor((skillDuration * 3) / 4);
            }
          } else {
            console.log("perMatch[1]为空");
          }
        }
      } else {
        console.log("未注明前摇值，默认为技能总时长：" + floor((skillDuration * 3) / 4) + "帧");
      }
      return floor((skillDuration * 3) / 4);
    };
    // 计算技能动作期间角色和怪物的状态数据
    const stateFrameComputer = (
      character: CharacterData,
      monster: MonsterData,
      computeArg: computeArgType,
      eventSequence: eventSequenceType[],
    ): stateFrameData[] => {
      const stateFrames: stateFrameData[] = [
        {
          frame: 0,
          character,
          monster,
        },
      ];
      for (let frame = 0; frame < this.skillDuration; frame++) {
        eventSequence = frameData(passedFrames + frame, character, monster, computeArg, eventSequence, cEvaluate);
        // console.log("-----------------当前技能帧", frame,"当前角色属性：", _.cloneDeep(character));
        stateFrames.push({
          frame: frame,
          character: _.cloneDeep(character),
          monster: _.cloneDeep(monster),
        });
      }
      this.finalEventSequence = eventSequence;
      return stateFrames;
    };
    Index++;
    this.index = Index;
    this.name = skill.name;
    this.lv = skill.level ?? 0;
    this.vMatk = {
      baseValue:
        ((dynamicTotalValue(characterData.mAtk) + characterData.lv - monsterData.lv) *
          (100 - dynamicTotalValue(monsterData.mRes))) /
          100 -
        ((100 - dynamicTotalValue(characterData.pPie)) / 100) * dynamicTotalValue(monsterData.pDef),
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
      update: () => "",
    };
    this.vPatk = {
      baseValue:
        ((dynamicTotalValue(characterData.pAtk) + characterData.lv - monsterData.lv) *
          (100 - dynamicTotalValue(monsterData.pRes))) /
          100 -
        ((100 - dynamicTotalValue(characterData.mPie)) / 100) * dynamicTotalValue(monsterData.mDef),
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
      update: () => "",
    };
    this.am = {
      baseValue: dynamicTotalValue(characterData.am),
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
      update: () => "",
    };
    this.cm = {
      baseValue: dynamicTotalValue(characterData.cm),
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
      update: () => "",
    };
    // this.actionFixedDurationFormula = skill.skillEffect.actionBaseDurationFormula;
    // this.actionModifiableDurationFormula = skill.skillEffect.actionModifiableDurationFormula;
    // this.chantingFixedDurationFormula = skill.skillEffect.chantingBaseDurationFormula;
    // this.chantingModifiableDurationFormula = skill.skillEffect.chantingModifiableDurationFormula;
    this.actionFixedDuration = {
      baseValue: cEvaluate(skill.skillEffect.actionBaseDurationFormula) as number,
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
      update: () => "",
    };
    this.actionModifiableDuration = {
      baseValue: cEvaluate(skill.skillEffect.actionModifiableDurationFormula) as number,
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
      update: () => "",
    };
    this.chantingFixedDuration = {
      baseValue: cEvaluate(skill.skillEffect.chantingBaseDurationFormula) as number,
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
      update: () => "",
    };
    console.log(
      "技能可加速咏唱计算公式：" + skill.skillEffect.chantingModifiableDurationFormula,
      "计算环境：",
      _.cloneDeep(computeArg),
    );
    this.chantingModifiableDuration = {
      baseValue: cEvaluate(skill.skillEffect.chantingModifiableDurationFormula) as number,
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
      update: () => "",
    };
    this.skillActionFrames = floor(
      dynamicTotalValue(this.actionFixedDuration) +
        (dynamicTotalValue(this.actionModifiableDuration) * (100 - min(dynamicTotalValue(this.am), 50))) / 100,
    );
    this.skillChantingFrames = floor(
      dynamicTotalValue(this.chantingFixedDuration) +
        (dynamicTotalValue(this.chantingModifiableDuration) * (100 - min(dynamicTotalValue(this.cm), 50))) / 100,
    );
    this.skillDuration = this.skillActionFrames + this.skillChantingFrames * fps;
    this.skillWindUp = skillWindUpComputer(skill.skillEffect.skillWindUpFormula, this.skillDuration, computeArg);
    computeArg.s = _.cloneDeep(this);
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
          condition: "frame > " + (passedFrames + this.skillWindUp - 2) + " and " + baseCondition,
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
    this.stateFramesData = stateFrameComputer(characterData, monsterData, computeArg, eventSequence);
  }
}

const frameData = (
  frame: number,
  character: CharacterData,
  monster: MonsterData,
  computeArg: computeArgType,
  eventSequence: eventSequenceType[],
  cEvaluate: (formula: string) => number | void,
) => {
  // 发送结果
  self.postMessage({
    type: "progress",
    computeResult: "已完成:" + frame + "帧",
  } satisfies analyzeWorkerOutput);
  // 每帧需要做的事
  computeArg.frame = frame;

  monster.hp.modifiers.dynamic.fixed.push({
    value: -5000,
    origin: "测试阶段系统自动减损" + frame,
  });

  // 检查怪物死亡
  if (isNumber(monster.hp.baseValue) ? monster.hp.baseValue <= 0 : dynamicTotalValue(monster.hp) <= 0) {
    console.log("怪物死亡");
  }

  // 定义一个自定义节点转换函数
  function replaceNode(node: MathNode) {
    // 如果节点是AccessorNode，替换成FunctionNode dynamicTotalValue(SymbolNode)
    if ("isAccessorNode" in node && node.isAccessorNode) {
      return new math.FunctionNode(new math.SymbolNode("dynamicTotalValue"), [node]);
    }
    // 遍历节点的子节点并递归替换
    return node.map(replaceNode);
  }

  // 执行并更新事件队列
  // console.log("执行事件过滤前，事件队列为：", eventSequence);
  eventSequence = eventSequence.filter((event, index) => {
    console.log("第 " + frame + " 帧的第 " + index + " 个事件：", event);
    if (cEvaluate(event.condition)) {
      // 执行当前帧需要做的事
      console.log("条件成立，执行：" + event.behavior);
      const node = parse(event.behavior);
      const nodeString = node.toString();
      switch (node.type) {
        case "AssignmentNode":
          {
            const attr = nodeString.substring(0, nodeString.indexOf("=")).trim();
            const formulaStr = nodeString.substring(nodeString.indexOf("=") + 1, nodeString.length).trim();
            console.log("发现赋值节点：" + nodeString);
            console.log("赋值对象路径：", attr);
            const modifier = new modifiers();
            console.log("baseValue值表达式结果：", cEvaluate(formulaStr));
            if (isNumber(cEvaluate(formulaStr))) {
              modifier.baseValue = cEvaluate(formulaStr) as number;
            }
            _.set(computeArg, attr, modifier);
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
              // 将属性节点转换成总值计算
              const subNode = parse(formulaStr);
              const transformSubNode = replaceNode(subNode);
              const transformSubNodeStr = transformSubNode.toString();
              console.log("转换后的表达式：", transformSubNodeStr);
              // 如果能够发现加减乘除运算符，则对符号左右侧字符串进行验证
              console.log(
                "表达式拆解为：1:[" + targetStr + "]   2:[" + operatorStr + "]   3:[" + transformSubNodeStr + "]",
              );
              // 查找对应对象的内部属性值

              let target: modifiers | number | undefined;
              if (_.get(computeArg, targetStr)) {
                target = _.get(computeArg, targetStr) as modifiers;
                console.log("找到了：", target);
                // 先判断值类型，依据字符串结尾是否具有百分比符号分为百分比加成和常数加成
                const perMatch = transformSubNodeStr.match(/^([\s\S]+?)\s*(%?)$/);
                if (perMatch) {
                  // 表达式非空时
                  if (perMatch[2] === "%") {
                    // 当末尾存在百分比符号时，尝试将计算结果添加进百分比数组中
                    console.log("表达式值为百分比类型，非百分号部分：", perMatch[1]);
                    if (perMatch[1]) {
                      // 尝试计算表达式结果
                      const result = cEvaluate(perMatch[1]);
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
                    const result = cEvaluate(transformSubNodeStr);
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
                // 更新相关值
                console.log("将更新受影响的属性：" + target.update());
              } else {
                console.log("在计算上下文中没有找到对应的自定义属性:" + targetStr);
              }
            } else {
              // 如果未匹配到，则返回空字符串或其他你希望的默认值
              console.log("在：" + event.behavior + "中没有匹配到内容");
            }
          }
          break;
      }
      console.log("----------结果：", _.cloneDeep(computeArg));
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
  // console.log("执行事件过滤后，事件队列为：", eventSequence);
  return _.cloneDeep(eventSequence);
};

export const computeFrameData = (
  dictionary: ReturnType<typeof getDictionary>,
  skillSequence: tSkill[],
  character: Character,
  monster: Monster,
) => {
  const characterData = new CharacterData(dictionary, character);
  const monsterData = new MonsterData(monster);
  const skillData = new SkillData(
    dictionary,
    0,
    skillSequence[0]!,
    characterData,
    monsterData,
    {
      frame: 0,
      p: characterData,
      m: monsterData,
    },
    [],
    0,
  );
  const computeArg: computeArgType = {
    frame: 0,
    p: characterData,
    m: monsterData,
    s: skillData,
  };

  let eventSequence: eventSequenceType[] = [];
  const result: SkillData[] = [];
  skillSequence.forEach((skill, index) => {
    let passedFrames = 0;
    result.forEach((skillData) => {
      passedFrames += skillData.skillDuration + 1;
    });
    // console.log("当前已储存的结果：", _.cloneDeep(result));
    const newSkill = _.cloneDeep(
      new SkillData(dictionary, index, skill, characterData, monsterData, computeArg, eventSequence, passedFrames),
    );
    eventSequence = newSkill.finalEventSequence;
    result.push(newSkill);
  });

  return result;
};

const self = globalThis;

self.onmessage = (e: MessageEvent<analyzeWorkerInput>) => {
  switch (e.data.type) {
    case "start":
      {
        // 接收消息
        if (e.data.arg) {
          const { dictionary, skillSequence, character, monster } = e.data.arg;
          // 执行计算
          const result = computeFrameData(dictionary, skillSequence, character, monster);
          console.log("计算结果：", result);
          // 发送结果
          self.postMessage({
            type: "success",
            // 需要过滤掉其中的函数属性
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            computeResult: JSON.parse(JSON.stringify(result)),
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
        // console.error("Unhandled message type:", e);
      }
      break;
  }
};
