import React from "react";
import { type modifiers, type CharacterData, type MonsterData, type SkillData, dynamicTotalValue } from "./worker";

// 类型谓词函数，用于检查对象是否符合目标类型
function isTargetType(obj: unknown): obj is modifiers {
  // 检查对象是否为目标类型
  const isModifier = typeof obj === "object" && obj !== null && "baseValue" in obj && "modifiers" in obj;
  return isModifier;
}

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
      if (typeof value === "object" && value !== null) {
        if (!isTargetType(value)) {
          return (
            <div key={currentPath} className="pl-2 lg:pl-4">
              <strong>{currentPath}</strong>
              {renderObject(value, [...path, key])}
            </div>
          );
        }
        return (
          <div
            key={currentPath}
            className="Modifiers flex flex-col lg:flex-row w-full gap-1 lg:gap-4 rounded-sm border-[1px] border-brand-color-1st p-1"
          >
            <span className="TotalValue lg:w-[17%] bg-brand-color-1st px-1 lg:px-3 py-1">
              <div className="Key text-accent-color-70">{key}：</div>
              <div className="Value font-bold">{dynamicTotalValue(value)}</div>
            </span>
            <div className="Values flex flex-1 flex-wrap gap-1 lg:gap-4">
              <div className="BaseVlaue flex w-[25%] lg:w-[10%] flex-col">
                <span className="BaseValueName text-sm text-accent-color-70">BaseValue</span>
                <span className="Value font-bold">{value.baseValue}</span>
              </div>

              <div className="ModifierVlaue flex w-full flex-1 flex-col bg-transition-color-8">
                <span className="ModifierValueName border-b-[1px] border-brand-color-1st px-1 text-sm text-accent-color-70">
                  Modifiers
                </span>
                <div className="ModifierValueContent flex gap-2">
                  <div className="ModifierStaticBox flex flex-col w-[50%] border-r-[1px] border-brand-color-1st px-1">
                    <span className="ModifierStaticName text-sm text-accent-color-70">Static</span>
                    <div className="ModifierStaticContent flex gap-1">
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

                      <div className="ModifierStaticPercentageBox flex gap-1 flex-wrap">
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
                    </div>
                  </div>
                  <div className="ModifierDynamicBox flex flex-col">
                    <span className="ModifierDynamicName text-sm text-accent-color-70">Dynamic</span>
                    <div className="ModifierDynamicContent flex flex-col">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div key={currentPath} className="px-2 lg:px-4 py-1">
            <strong>{currentPath}</strong>: {JSON.stringify(value)}
          </div>
        );
      }
    });
  };

  return <div className="RenderObject flex w-full flex-col p-1 gap-1">{renderObject(data)}</div>;
};
