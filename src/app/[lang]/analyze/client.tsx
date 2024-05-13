"use client";
import * as math from "mathjs";
import React, { useEffect, useRef, useState } from "react";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";

import { test, useStore } from "~/app/store";
import Button from "../_components/button";
import Dialog from "../_components/dialog";
import { type analyzeWorkerInput, type SkillData, type analyzeWorkerOutput, type tSkill } from "./worker";

export interface Props {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}
export default function AnalyzePageClient(props: Props) {
  const { dictionary } = props;
  const skillSequence: tSkill[] = [
    {
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "神速掌握",
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
        skillExtraActionType: "None",
        chargingBaseDurationFormula: "",
        chargingModifiableDurationFormula: "",
        chantingBaseDurationFormula: "0",
        chantingModifiableDurationFormula: "0",
        skillWindUpFormula: "13",
        skillRecoveryFormula: "0",
        belongToskillId: "",
        skillCost: [
          {
            id: "",
            name: "MP Cost",
            costFormula: "100",
            skillEffectId: null,
          },
        ],
        skillYield: [
          {
            id: "",
            name: "角色行动速度+10%",
            yieldType: "ImmediateEffect",
            yieldFormula: "p.am + 10",
            mutationTimingFormula: null,
            skillEffectId: null,
          },
          {
            id: "",
            name: "角色攻速+300",
            yieldType: "ImmediateEffect",
            mutationTimingFormula: null,
            yieldFormula: "p.aspd + 300",
            skillEffectId: null,
          },
        ],
      },
    },
    {
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "神速掌握",
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
        skillExtraActionType: "None",
        chargingBaseDurationFormula: "",
        chargingModifiableDurationFormula: "",
        chantingBaseDurationFormula: "0",
        chantingModifiableDurationFormula: "0",
        skillWindUpFormula: "13",
        skillRecoveryFormula: "0",
        belongToskillId: "",
        skillCost: [
          {
            id: "",
            name: "MP Cost",
            costFormula: "100",
            skillEffectId: null,
          },
        ],
        skillYield: [
          {
            id: "",
            name: "角色行动速度+10%",
            yieldType: "ImmediateEffect",
            yieldFormula: "p.am + 10",
            mutationTimingFormula: null,
            skillEffectId: null,
          },
          {
            id: "",
            name: "角色攻速+300",
            yieldType: "ImmediateEffect",
            mutationTimingFormula: null,
            yieldFormula: "p.aspd + 300",
            skillEffectId: null,
          },
        ],
      },
    },
    {
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "神速掌握",
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
        skillExtraActionType: "None",
        chargingBaseDurationFormula: "",
        chargingModifiableDurationFormula: "",
        chantingBaseDurationFormula: "0",
        chantingModifiableDurationFormula: "0",
        skillWindUpFormula: "13",
        skillRecoveryFormula: "0",
        belongToskillId: "",
        skillCost: [
          {
            id: "",
            name: "MP Cost",
            costFormula: "100",
            skillEffectId: null,
          },
        ],
        skillYield: [
          {
            id: "",
            name: "角色行动速度+10%",
            yieldType: "ImmediateEffect",
            yieldFormula: "p.am + 10",
            mutationTimingFormula: null,
            skillEffectId: null,
          },
          {
            id: "",
            name: "角色攻速+300",
            yieldType: "ImmediateEffect",
            mutationTimingFormula: null,
            yieldFormula: "p.aspd + 300",
            skillEffectId: null,
          },
        ],
      },
    },
    {
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "魔法炮充填",
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
            mutationTimingFormula: "frame % 60 == 0 and frame > 0",
            yieldFormula: "p.mfp + ( p.mfp >= 100 ? 1/3 : 1 )",
            skillEffectId: null,
          },
        ],
      },
    },
    {
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "冲击波",
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
            yieldFormula: "m.hp - (vMatk + 200) * 500%",
            mutationTimingFormula: null,
            skillEffectId: null,
          },
          {
            id: "",
            name: "MP Cost half",
            yieldType: "PersistentEffect",
            yieldFormula: "",
            skillEffectId: null,
            mutationTimingFormula: "false",
          },
        ],
      },
    },
    {
      id: "",
      state: "PUBLIC",
      skillTreeName: "MAGIC",
      name: "爆能",
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
            yieldFormula: "1+1",
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
  const workerRef = useRef<Worker>();
  const { analyzeDialogState, setAnalyzeDialogState } = useStore((state) => state.analyzePage);
  const [computeResult, setComputeResult] = useState<React.ReactNode>(null);

  useEffect(() => {
    console.log("--ComboAnalyze Client Render");

    // 预定义的颜色数组
    const colors: string[] = [];
    // 生成 14 个颜色值
    for (let i = 0; i < 15; i++) {
      const hue = math.floor((i * (360 / 15)) % 360); // 色相值，从蓝色开始逐渐增加
      const saturation = "60%"; // 饱和度设置为 100%
      const lightness = "50%"; // 亮度设置为 50%

      // 将 HSL 颜色值转换为 CSS 格式的字符串
      const color = `hsl(${hue}, ${saturation}, ${lightness})`;

      colors.push(color);
    }

    function stringToColor(str: string) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i);
      }

      // 将散列值映射到颜色数组的索引范围内
      const index = hash % colors.length;

      // 返回对应索引的颜色值
      return colors[index];
    }

    workerRef.current = new Worker(new URL("./worker.ts", import.meta.url));

    workerRef.current.onmessage = (e: MessageEvent<analyzeWorkerOutput>) => {
      const { type, computeResult } = e.data;
      switch (type) {
        case "progress":
          {
            const result = computeResult as string;
            setComputeResult(<div className="Result my-10 flex items-end">{result}</div>);
          }
          break;
        case "success":
          {
            const result = computeResult as SkillData[];
            setComputeResult(
              <>
                <div className="Result my-10 flex items-end">
                  <div className="DPS flex flex-1 items-end gap-2 rounded bg-brand-color-3rd p-4 lg:bg-transparent lg:p-0">
                    <span className="Key py-2 text-sm">DPS</span>
                    <span className="Value text-primary-color text-6xl lg:text-8xl lg:text-accent-color">
                      {math.floor(test.monster.maxhp / (result.length / 60))}
                    </span>
                  </div>
                </div>
                <div className="TimeLine flex flex-1 flex-wrap gap-y-4 bg-transition-color-8 gap-2 lg:p-4">
                  {result.map((skill, skillIndex) => {
                    return (
                      <div key={skill.name + skillIndex} className={`SkillData relative flex rounded-sm`} style={{
                        width: 3 * skill.skillDuration,
                        backgroundColor: stringToColor(skill.name)
                      }}>
                        <div className="skillName pointer-events-none absolute left-2 top-1/2 z-10 -translate-y-1/2 text-nowrap text-primary-color">
                          {skill.name}
                        </div>
                        {skill.stateFramesData.map((frameData, frameIndex) => {
                          const frame = skill.passedFrames + frameIndex;
                          return (
                            <div key={skill.name + frameIndex} className="SkillContent flex flex-row">
                              <button
                                className="group relative min-h-12 w-[3px] lg:w-[6px]"
                              >
                                <div className="absolute w-fit min-w-[300px] -left-4 bottom-12 z-10 hidden flex-col gap-2 rounded bg-primary-color p-4 text-left shadow-2xl shadow-transition-color-20 backdrop-blur-xl lg:group-hover:z-20 lg:group-hover:flex">
                                  <div className="FrameAttr flex flex-col gap-1">
                                    <span className="Title">当前 {frame} 帧</span>
                                    <span className="Content bg-transition-color-8">
                                      第 {math.floor(frame / 60)} 秒的第 {frame % 60} 帧
                                      <br />
                                    </span>
                                  </div>
                                  <div className="SkillAttr flex flex-col gap-1">
                                    <span className="Title">Skill</span>
                                    <span className="Content bg-transition-color-8">
                                      {skill.name} 的第：{frameIndex} / {skill.skillDuration} 帧
                                      <br />
                                    </span>
                                  </div>
                                </div>
                                <div className="fixed left-1/2 top-0 z-10 hidden max-h-[80dvh] w-full -translate-x-1/2 flex-col gap-2 overflow-auto border-brand-color-1st bg-primary-color p-4 text-left shadow-2xl shadow-transition-color-20 backdrop-blur-xl group-hover:z-20 group-focus:flex lg:top-[2dvh] lg:max-h-[80dvh] lg:max-w-[calc(92dvw-67px)] lg:rounded lg:border-1.5">
                                  <div className="FrameAttr flex flex-col gap-1">
                                    <span className="Title">当前帧属性</span>
                                    <span className="Content bg-transition-color-8">
                                      第 {math.floor(frame / 60)} 秒的第 {frame % 60} 帧
                                      <br />
                                    </span>
                                  </div>
                                  <div className="SkillAttr flex flex-col gap-1">
                                    <span className="Title">Skill</span>
                                    <span className="Content bg-transition-color-8">
                                      位于 {skill.name} 的第：{frameIndex}帧
                                      <br />
                                    </span>
                                  </div>
                                  <div className="CharacterClass flex flex-col gap-1">
                                    <span className="Title">CharacterClass</span>
                                    <div className="Content flex flex-wrap bg-transition-color-8 outline-[1px] lg:gap-1">
                                      {Object.entries(frameData.character).map(([key, value]) => {
                                        return (
                                          <div
                                            key={key}
                                            className="lg:basis-1/8 m-1 rounded-sm border-[1px] border-brand-color-1st px-3 py-1"
                                          >
                                            <span className="Key text-sm text-accent-color-70">{key}</span>
                                            <br />
                                            <span className="Value font-bold">{JSON.stringify(value)}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  <div className="MonsterClass flex flex-col gap-1">
                                    <span className="Title">MonsterClass</span>
                                    <div className="Content flex flex-wrap bg-transition-color-8 outline-[1px] lg:gap-1">
                                      {Object.entries(frameData.monster).map(([key, value]) => {
                                        return (
                                          <div
                                            key={key}
                                            className="lg:basis-1/8 m-1 rounded-sm border-[1px] border-brand-color-1st px-3 py-1"
                                          >
                                            <span className="Key text-sm text-accent-color-70">{key}</span>
                                            <br />
                                            <span className="Value font-bold">{JSON.stringify(value)}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </>,
            );
          }
          break;
        case "error":
          {
            setComputeResult(<div className="Result my-10 flex items-end">发生错误</div>);
          }
          break;
        default:
          break;
      }
    };

    workerRef.current.onerror = (error) => {
      console.error("Worker error:", error);
    };

    return () => {
      console.log("--ComboAnalyze Client Unmount");
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const startCompute = () => {
    setComputeResult(null);
    const workerMessage: analyzeWorkerInput = {
      type: "start",
      arg: {
        skillSequence: skillSequence,
        character: test.character,
        monster: test.monster,
      },
    };
    if (workerRef.current) {
      workerRef.current.postMessage(workerMessage);
    }
  };

  const stopCompute = () => {
    const workerMessage: analyzeWorkerInput = {
      type: "stop",
    };
    if (workerRef.current) {
      workerRef.current.postMessage(workerMessage);
    }
  };

  const terminateWorker = () => {
    const workerMessage: analyzeWorkerInput = {
      type: "stop",
    };
    if (workerRef.current) {
      workerRef.current.postMessage(workerMessage);
      workerRef.current.terminate();
    }
  };

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
            <div className="SkillSequence flex flex-col items-start gap-4 lg:flex-row lg:items-center">
              <div className="Title">流程:</div>
              <div className="Content flex flex-wrap gap-2">
                {skillSequence.map((skill, index) => {
                  return (
                    <Button key={index} size="sm" level="tertiary">
                      {skill.name}
                    </Button>
                  );
                })}
                <Button size="sm" level="primary" onClick={startCompute}>
                  开始计算
                </Button>
              </div>
            </div>
            {computeResult}
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
