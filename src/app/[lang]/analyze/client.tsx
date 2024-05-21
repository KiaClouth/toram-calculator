"use client";
import * as math from "mathjs";
import React, { useEffect, useRef, useState } from "react";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";

import { test, useStore } from "~/app/store";
import Button from "../_components/button";
import Dialog from "../_components/dialog";
import {
  type computeInput,
  type computeOutput,
  type tSkill,
  dynamicTotalValue,
  type FrameData,
} from "./worker";
import { ObjectRenderer } from "./objectRender";
import LongSearchBox from "./monsterSearchBox";
import { type Monster } from "~/server/api/routers/monster";
import { type Character } from "~/server/api/routers/character";
import { computeMonsterAugmentedList } from "../monster/client";

export type skillSequenceList = {
  name: string;
  data: tSkill[];
};

export interface Props {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  monsterList: Monster[];
  characterList: Character[];
}

export default function AnalyzePageClient(props: Props) {
  const { dictionary } = props;

  // 状态管理参数
  const workerRef = useRef<Worker>();
  const { monsterList, setMonsterList } = useStore((state) => state.monsterPage);
  const { characterList, setCharacterList } = useStore((state) => state.characterPage);
  const { monster, setMonster, character, setCharacter } = useStore((state) => state);
  const { analyzeDialogState, setAnalyzeDialogState } = useStore((state) => state.analyzePage);
  const [computeResult, setComputeResult] = useState<React.ReactNode>(null);
  const [dialogFrameData, setDialogFrameData] = useState<FrameData | null>(null);
  const [dialogMeberIndex, setDialogMeberIndex] = useState<number>(0);
  const [defaultMonsterList] = useState(props.monsterList);
  const [team, setTeam] = useState<computeInput["arg"]["team"]>([
    {
      config: test.character,
      actionQueue: test.skillSequence1.data,
    },
    {
      config: test.character,
      actionQueue: test.skillSequence2.data,
    },
  ]);

  useEffect(() => {
    console.log("--ComboAnalyze Client Render");
    setMonsterList(computeMonsterAugmentedList(defaultMonsterList, dictionary));
    setCharacterList(props.characterList);

    setCharacter(test.character);
    setMonster(test.monster);

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

    function stringToColor(str: string): string {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i);
      }

      // 将散列值映射到颜色数组的索引范围内
      const index = hash % colors.length;

      // 返回对应索引的颜色值
      return colors[index]!;
    }

    workerRef.current = new Worker(new URL("./worker.ts", import.meta.url));

    workerRef.current.onmessage = (e: MessageEvent<computeOutput>) => {
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
            const result = computeResult as FrameData[];
            const lastFrameData = result.at(-1);
            const RemainingHp = lastFrameData ? dynamicTotalValue(lastFrameData.monsterData.hp) : 0;
            const totalDamge = (lastFrameData?.monsterData.hp.baseValue ?? 0) - RemainingHp;
            const totalDuration = result.length / 60;
            const dps = totalDamge / totalDuration;
            setComputeResult(
              <>
                <div className="Result my-10 flex flex-col gap-4 lg:flex-row lg:items-end">
                  <div className="DPS flex flex-col gap-2 ">
                    <span className="Key py-2 text-sm">DPS</span>
                    <span className="Value border-y-[1px] border-brand-color-1st p-4 text-6xl lg:border-none lg:p-0 lg:text-8xl lg:text-accent-color">
                      {math.floor(math.abs(dps))}
                    </span>
                  </div>
                  <div className="OtherData flex flex-1 gap-2">
                    <div className="Duration flex flex-1 flex-col gap-1 rounded bg-transition-color-8 lg:p-4">
                      <span className="Key p-1 text-sm text-accent-color-70">总耗时</span>
                      <span className="Value p-1 text-xl lg:text-2xl lg:text-accent-color">
                        {math.floor(math.abs(totalDuration))} 秒
                      </span>
                    </div>
                    <div className="Duration flex flex-1 flex-col gap-1 rounded bg-transition-color-8 lg:p-4">
                      <span className="Key p-1 text-sm text-accent-color-70">总伤害</span>
                      <span className="Value p-1 text-xl lg:text-2xl lg:text-accent-color">
                        {math.floor(math.abs(totalDamge) / 10000)} 万
                      </span>
                    </div>
                    <div className="Duration flex flex-1 flex-col gap-1 rounded bg-transition-color-8 lg:p-4">
                      <span className="Key p-1 text-sm text-accent-color-70">怪物剩余HP</span>
                      <span className="Value p-1 text-xl lg:text-2xl lg:text-accent-color">
                        {math.floor(math.abs(RemainingHp) / 10000)}万
                      </span>
                    </div>
                  </div>
                </div>
                <div className="TimeLine flex flex-col gap-4">
                  <div className="Title border-b-2 border-brand-color-1st p-2">
                    <span className="Key p-1 ">时间轴</span>
                  </div>
                  <div className="Content flex flex-1 flex-wrap gap-y-4 shadow-transition-color-20 drop-shadow-2xl">
                    {result.map((frameData, frame) => {
                      return (
                        <div
                          key={"frameData" + frame}
                          className={`FrameData${frame} flex flex-col justify-around gap-1`}
                        >
                          {frameData.teamState.map((member, memberIndex) => {
                            const color = stringToColor(member?.skillData.name ?? "");
                            return frame === 0 ? (
                              <button className="MemberName p-1 text-sm " key={"member" + memberIndex}>
                                {member?.name}
                              </button>
                            ) : (
                              <button
                                className={`MemberData group relative h-4 px-[1px] `}
                                key={"member" + memberIndex}
                                style={{
                                  backgroundColor: member ? color : "transparent",
                                }}
                                onClick={() => {
                                  console.log("点击了队员：", member?.name, "的第：", frame, "帧");
                                  if (member) {
                                    setDialogFrameData(frameData);
                                    setAnalyzeDialogState(true);
                                  }
                                }}
                              >
                                {member ? (
                                  <div className="absolute -left-4 bottom-14 z-10 hidden w-fit min-w-[300px] flex-col gap-2 rounded bg-primary-color p-2 text-left shadow-2xl shadow-transition-color-20 backdrop-blur-xl lg:group-hover:z-20 lg:group-hover:flex">
                                    <div className="FrameAttr flex flex-col gap-1 bg-transition-color-8 p-1">
                                      <span className="Title font-bold">队员: {member?.name}</span>
                                      <span className="Content">
                                        第 {math.floor(frame / 60)} 秒的第 {frame % 60} 帧
                                        <br />
                                      </span>

                                      <span className="Content ">
                                        技能 {member?.actionIndex ?? 0 + 1} {member?.skillData.name} 的第：
                                        {member?.actionFrameIndex} / {member?.skillData.skillDuration} 帧
                                        <br />
                                      </span>
                                    </div>
                                  </div>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
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
  }, [
    defaultMonsterList,
    dictionary,
    props.characterList,
    props.monsterList,
    setAnalyzeDialogState,
    setCharacter,
    setCharacterList,
    setMonster,
    setMonsterList,
  ]);

  const startCompute = () => {
    setComputeResult(null);
    const workerMessage: computeInput = {
      type: "start",
      arg: {
        dictionary: dictionary,
        team: team,
        monster: monster,
      },
    };
    if (workerRef.current) {
      workerRef.current.postMessage(workerMessage);
    }
  };

  // const stopCompute = () => {
  //   const workerMessage: computeInput = {
  //     type: "stop",
  //   };
  //   if (workerRef.current) {
  //     workerRef.current.postMessage(workerMessage);
  //   }
  // };

  // const terminateWorker = () => {
  //   const workerMessage: computeInput = {
  //     type: "stop",
  //   };
  //   if (workerRef.current) {
  //     workerRef.current.postMessage(workerMessage);
  //     workerRef.current.terminate();
  //   }
  // };

  return (
    <main className="flex flex-col lg:w-[calc(100dvw-96px)] lg:flex-row">
      <div
        className={`Module1 pointer-events-none invisible fixed left-0 top-0 z-50 flex-none basis-[0px] -translate-x-full border-transition-color-8 bg-primary-color opacity-0 backdrop-blur-xl lg:sticky lg:z-0 lg:translate-x-0 lg:border-x-1.5 lg:bg-transition-color-8`}
      >
        <div
          className={`Content flex h-dvh w-dvw flex-col gap-4 overflow-y-auto px-6 pt-8 lg:absolute lg:left-0 lg:top-0 lg:w-[260px]`}
        >
          <div className="Title flex items-center justify-between">
            <h1 className="text-lg">{dictionary.ui.filter}</h1>
            <Button level="tertiary">X</Button>
          </div>
        </div>
      </div>
      <div className="Module2 flex flex-1 px-3 backdrop-blur-xl">
        <div className="LeftArea sticky top-0 z-10 flex-1"></div>
        <div
          className={`ModuleContent h-[calc(100dvh-67px)] w-full flex-col overflow-y-auto lg:h-dvh lg:max-w-[1536px]`}
        >
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
          <div className="Content flex flex-col gap-4">
            <div className="MonsterConfig flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="Title flex gap-4">
                <span className="Key">怪物：</span>
                <span className="MonsterName font-bold">{monster.name}</span>
              </div>
              <LongSearchBox dictionary={dictionary} monsterList={monsterList} setMonster={setMonster} />
            </div>
            <div className="TeamConfig flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="Title flex flex-col gap-4">队伍配置：</div>
              <div className="Content flex flex-col">
                {team.map((member, index) => {
                  return (
                    <div
                      key={"member" + index}
                      className="Member flex flex-col gap-4 border-b border-transition-color-20 p-4 lg:flex-row lg:items-center"
                    >
                      <div className="CharacterConfig flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="Title flex gap-4">
                          <span className="Key">角色：</span>
                          <span className="CharacterName font-bold">{member.config.name}</span>
                        </div>
                      </div>
                      <div className="SkillSequence flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="Title">流程：</div>
                        <div className="Content flex flex-wrap gap-2">
                          {member.actionQueue.map((skill, index) => {
                            return (
                              <Button key={index} size="sm" level="tertiary">
                                {skill.name}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button size="sm" level="primary" onClick={startCompute}>
              开始计算
            </Button>
            {computeResult}
          </div>
        </div>
        <div className="RightArea sticky top-0 z-10 flex-1"></div>
      </div>

      <Dialog state={analyzeDialogState} setState={setAnalyzeDialogState}>
        {analyzeDialogState && (
          <div className="Content flex w-dvw flex-col overflow-y-auto p-2 lg:p-4 2xl:w-[1536px]">
            <div className="Title flex items-center gap-6">
              {/* <div className="h-[2px] flex-1 bg-accent-color"></div> */}
              <span className="text-lg font-bold lg:text-2xl">当前帧属性</span>
              <div className="h-[2px] flex-1 bg-accent-color"></div>
            </div>
            <div className="Content flex flex-col gap-4 overflow-y-auto">
              <div className="FrameAttr mt-4 flex flex-col gap-1 bg-transition-color-8 p-2 lg:flex-row">
                <span className="Content">
                  帧信息： {math.floor((dialogFrameData?.frame ?? 0) / 60)} 秒的第 {(dialogFrameData?.frame ?? 0) % 60}{" "}
                  帧
                </span>
              </div>
              <div className="CharacterData flex flex-col gap-1">
                <div className="Title sticky top-0 z-10 flex items-center gap-6 bg-primary-color pt-4">
                  <span className="Title text-base font-bold lg:text-xl">Character</span>
                  <div className="h-[1px] flex-1 bg-brand-color-1st"></div>
                </div>
                <div className="Content flex flex-wrap outline-[1px] lg:gap-1">
                  <div className="Tab flex flex-wrap gap-1">
                    {dialogFrameData?.teamState.map((member, memberIndex) => {
                      return (
                        <Button
                          key={"member" + memberIndex}
                          onClick={() => setDialogMeberIndex(memberIndex)}
                          size="sm"
                          level="tertiary"
                        >
                          {member?.name}
                        </Button>
                      );
                    })}
                  </div>
                  {dialogFrameData?.teamState.map((member, memberIndex) => {
                    return (
                      <ObjectRenderer
                        key={"member" + memberIndex}
                        data={member?.characterData}
                        dictionary={dictionary}
                        display={dialogMeberIndex === memberIndex}
                      />
                    );
                  })}
                  <div className="Title flex items-center gap-6 bg-primary-color pt-4">
                    <span className="Title text-base font-bold">Skill</span>
                    <div className="h-[1px] flex-1 bg-brand-color-1st"></div>
                  </div>
                  {dialogFrameData?.teamState.map((member, memberIndex) => {
                    return (
                      <ObjectRenderer
                        key={"member" + memberIndex}
                        data={member?.skillData}
                        dictionary={dictionary}
                        display={dialogMeberIndex === memberIndex}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="MonsterData flex flex-col gap-1">
                <div className="Title sticky top-0 z-10 flex items-center gap-6 bg-primary-color pt-4">
                  <span className="Title text-base font-bold lg:text-xl">Monster</span>
                  <div className="h-[1px] flex-1 bg-brand-color-1st"></div>
                </div>
                <div className="Content flex flex-wrap outline-[1px] lg:gap-1">
                  {dialogFrameData ? (
                    <ObjectRenderer dictionary={dictionary} data={dialogFrameData.monsterData} display />
                  ) : null}
                </div>
              </div>
            </div>
            <div className="FunctionArea flex flex-col justify-end gap-4 bg-primary-color">
              <div className="h-[1px] flex-none bg-brand-color-1st"></div>
              <div className="btnGroup flex gap-2">
                <Button
                  onClick={() => {
                    setAnalyzeDialogState(false);
                  }}
                >
                  {dictionary.ui.close} [Esc]
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </main>
  );
}
