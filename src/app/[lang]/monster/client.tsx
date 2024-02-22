"use client";
import { type getDictionary } from "get-dictionary";
import LongSearchBox from "./search-monster";
import Table from "./table-monster";
import { type Monster } from "@prisma/client";
import { type Session } from "next-auth";
import MonsterDialog from "./display-monster";
import { useState } from "react";

export default function MonserPageClient(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  monsterList: Monster[];
}) {
  const { dictionary, session, monsterList } = props;
  // 怪物数据的初始值
  const defaultMonster: Monster = {
    id: "",
    updatedAt: new Date(),
    updatedById: "",
    state: "PRIVATE",
    name: "",
    type: "COMMON_BOSS",
    baseLv: 0,
    experience: 0,
    address: "",
    element: "NO_ELEMENT",
    radius: 1,
    maxhp: 0,
    physicalDefense: 0,
    physicalResistance: 0,
    magicalDefense: 0,
    magicalResistance: 0,
    criticalResistance: 0,
    avoidance: 0,
    dodge: 0,
    block: 0,
    normalAttackResistanceModifier: 0,
    physicalAttackResistanceModifier: 0,
    magicalAttackResistanceModifier: 0,
    difficultyOfTank: 0,
    difficultyOfMelee: 0,
    difficultyOfRanged: 0,
    possibilityOfRunningAround: 0,
    specialBehavior: "",
    createdByUserId: "",
  };
  const [monster, setMonser] = useState<Monster>(defaultMonster);
  const [monsterDialogState, setMonsterDialogState] = useState(false);
  return (
    <main className="Main flex flex-1">
      {/* <div className="Module1 hidden max-w-60 flex-shrink flex-col bg-bg-grey-20 "></div> */}
      <div className="Module2 flex flex-1">
        <div className="LeftArea flex-1"></div>
        <div className="ModuleContent flex h-dvh max-w-[100dvw] flex-1 basis-full flex-col-reverse lg:flex-col 2xl:max-w-[1536px] 2xl:basis-[1536px]">
          <LongSearchBox
            dictionary={dictionary}
            monsterList={monsterList}
            setMonsteData={setMonser}
            setMonsterDialogState={setMonsterDialogState}
          />
          <Table
            defaultMonster={defaultMonster}
            dictionary={dictionary}
            tableData={monsterList}
            session={session}
            setMonsteData={setMonser}
            setMonsterDialogState={setMonsterDialogState}
          />
        </div>
        <div className="RightArea flex-1"></div>
      </div>
      <MonsterDialog
        dictionary={dictionary}
        data={monster}
        open={monsterDialogState}
        setOpen={setMonsterDialogState}
      />
    </main>
  );
}
