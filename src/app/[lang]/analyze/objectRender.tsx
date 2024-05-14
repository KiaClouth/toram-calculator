import React from "react";
import { type modifiers, type CharacterData, type MonsterData, type SkillData, dynamicTotalValue } from "./worker";

// 类型谓词函数，用于检查对象是否符合目标类型
function isTargetType(obj: unknown): obj is modifiers {
  // 检查对象是否为目标类型
  const isModifier = typeof obj === "object" && obj !== null && "baseValue" in obj && "modifiers" in obj;
  return isModifier;
}

const hiddenKey: (keyof SkillData | keyof CharacterData | keyof MonsterData)[] = [
  "finalEventSequence",
  "passedFrames",
  "stateFramesData",
];

// 用于递归遍历对象并生成DOM结构的组件
export const ObjectRenderer = (props: { data?: SkillData | CharacterData | MonsterData }) => {
  if (!props.data) {
    return null;
  }
  const { data } = props;
  // 递归遍历对象的辅助函数
  const renderObject = (obj: unknown, path: string[] = []) => {
    return Object.entries(obj ?? {}).map(([key, value]) => {
      const currentPath = [...path, key].join(".");
      if (hiddenKey.some((item) => key === item)) return <></>;
      if (typeof value === "object" && value !== null) {
        if (!isTargetType(value)) {
          return (
            <div
              key={currentPath}
              className={`Object flex flex-col gap-1 rounded-sm border-[1px] border-transition-color-20 p-1 ${!currentPath.includes(".") && "lg:w-[calc((100%-12px)/4)]"}`}
            >
              <strong>{currentPath}</strong>
              {renderObject(value, [...path, key])}
            </div>
          );
        }
        return (
          <div
            key={currentPath}
            className={`Modifiers flex w-full flex-none flex-col gap-1 rounded-sm bg-transition-color-8 p-1 ${!(value.modifiers.static.fixed.length > 0 || value.modifiers.static.percentage.length > 0) && !currentPath.includes(".") && "lg:w-[calc((100%-12px)/4)]"}`}
          >
            <div className="Key text-sm text-accent-color-70">{key}：</div>

            {value.modifiers.static.fixed.length > 0 || value.modifiers.static.percentage.length > 0 ? (
              <div className="Values flex flex-1 flex-wrap gap-1 border-t-[1px] border-transition-color-20 lg:gap-4">
                <div
                  className={`TotalValue flex flex-col rounded-sm p-1 ${!(value.modifiers.static.fixed.length > 0 || value.modifiers.static.percentage.length > 0) && "w-full"}`}
                >
                  <div className="Key text-sm text-accent-color-70">ActualValue</div>
                  <div className="Value basis-1/5 text-nowrap rounded-sm px-1 font-bold">
                    {dynamicTotalValue(value)}
                  </div>
                </div>
                <div className="BaseVlaue flex w-[25%] flex-col rounded-sm p-1 lg:w-[10%]">
                  <span className="BaseValueName text-sm text-accent-color-70">BaseValue</span>
                  <span className="Value basis-1/5 text-nowrap rounded-sm px-1 font-bold">{value.baseValue}</span>
                </div>
                <div className="ModifierVlaue flex w-full flex-1 flex-col rounded-sm p-1">
                  <span className="ModifierValueName px-1 text-sm text-accent-color-70">Modifiers</span>
                  <div className="ModifierValueContent flex gap-1">
                    {(value.modifiers.static.fixed.length > 0 || value.modifiers.static.percentage.length > 0) && (
                      <div className="ModifierStaticBox flex flex-1 flex-col  px-1">
                        <span className="ModifierStaticName text-sm text-accent-color-70">Static</span>
                        <div className="ModifierStaticContent flex flex-wrap gap-1 text-nowrap rounded-sm p-2">
                          {value.modifiers.static.fixed.length > 0 && (
                            <div className="ModifierStaticFixedBox flex gap-2">
                              {value.modifiers.static.fixed.map((mod, index) => {
                                return (
                                  <div
                                    key={"ModifierStaticFixed" + index}
                                    className="ModifierStaticFixed group relative flex items-center gap-1 rounded-sm bg-transition-color-20 px-1 py-0.5"
                                  >
                                    <span className="BaseValueName text-sm text-accent-color-70">Fixed</span>
                                    <span className="Value font-bold">{mod.value}</span>
                                    <span className="Origin buttom-full absolute left-0 z-10 hidden rounded-sm bg-primary-color p-2 text-sm text-accent-color-70 shadow-xl shadow-transition-color-8 group-hover:flex">
                                      来源：{mod.origin}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {value.modifiers.static.percentage.length > 0 && (
                            <div className="ModifierStaticPercentageBox flex flex-wrap gap-1">
                              {value.modifiers.static.percentage.map((mod, index) => {
                                return (
                                  <div
                                    key={"ModifierStaticPercentage" + index}
                                    className="ModifierStaticPercentage group relative flex items-center gap-1 rounded-sm bg-transition-color-20 px-1 py-0.5"
                                  >
                                    <span className="BaseValueName text-sm text-accent-color-70">Percentage</span>
                                    <span className="Value font-bold">{mod.value}</span>
                                    <span className="Origin buttom-full absolute left-0 z-10 hidden rounded-sm bg-primary-color p-2 text-sm text-accent-color-70 shadow-xl shadow-transition-color-8 group-hover:flex">
                                      来源：{mod.origin}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {(value.modifiers.dynamic.fixed.length > 0 || value.modifiers.dynamic.percentage.length > 0) && (
                      <div className="ModifierDynamicBox flex flex-1 flex-col">
                        <span className="ModifierDynamicName text-sm text-accent-color-70">Dynamic</span>
                        <div className="ModifierDynamicContent flex flex-wrap gap-1 text-nowrap rounded-sm p-2">
                          {value.modifiers.dynamic.fixed.length > 0 && (
                            <div className="ModifierDynamicFixedBox flex flex-1 flex-wrap gap-1">
                              {value.modifiers.dynamic.fixed.map((mod, index) => {
                                return (
                                  <div
                                    key={"ModifierDynamicFixed" + index}
                                    className="ModifierDynamicFixed group relative flex items-center gap-1 rounded-sm bg-transition-color-20 px-1 py-0.5"
                                  >
                                    <span className="BaseValueName text-sm text-accent-color-70">Fixed</span>
                                    <span className="Value font-bold">{mod.value}</span>
                                    <span className="Origin buttom-full absolute left-0 z-10 hidden rounded-sm bg-primary-color p-2 text-sm text-accent-color-70 shadow-xl shadow-transition-color-8 group-hover:flex">
                                      来源：{mod.origin}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {value.modifiers.dynamic.percentage.length > 0 && (
                            <div className="ModifierDynamicPercentageBox flex">
                              {value.modifiers.dynamic.percentage.map((mod, index) => {
                                return (
                                  <div
                                    key={"ModifierDynamicPercentage" + index}
                                    className="ModifierDynamicPercentage group relative flex items-center gap-1 rounded-sm bg-transition-color-20 px-1 py-0.5"
                                  >
                                    <span className="BaseValueName text-sm text-accent-color-70">Percentage</span>
                                    <span className="Value font-bold">{mod.value}</span>
                                    <span className="Origin buttom-full absolute left-0 z-10 hidden rounded-sm bg-primary-color p-2 text-sm text-accent-color-70 shadow-xl shadow-transition-color-8 group-hover:flex">
                                      来源：{mod.origin}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="Value basis-1/5 text-nowrap rounded-sm px-1 font-bold">{dynamicTotalValue(value)}</div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={currentPath}
            className={`String flex w-full flex-none flex-col gap-1 rounded-sm bg-transition-color-8 p-1 lg:gap-4 ${!currentPath.includes(".") && "lg:w-[calc((100%-12px)/4)]"}`}
          >
            <span className={`TotalValue flex w-full flex-col rounded-sm p-1`}>
              <div className="Key text-sm text-accent-color-70">{key}：</div>
              <div className="Value basis-1/5 text-nowrap rounded-sm px-1 font-bold">{JSON.stringify(value)}</div>
            </span>
          </div>
        );
      }
    });
  };

  return (
    <div className="RenderObject flex w-full flex-col gap-1 p-1 lg:flex-row lg:flex-wrap">{renderObject(data)}</div>
  );
};
