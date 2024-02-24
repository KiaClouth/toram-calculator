"use client";
import { type getDictionary } from "~/app/get-dictionary";
import LongSearchBox from "./monsterSearchBox";
import Table from "./monsterTable";
import { type Monster } from "@prisma/client";
import { type Session } from "next-auth";
import MonsterDialog from "./monsterDialog";
import React, { useState } from "react";

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
    <React.Fragment>
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
      <MonsterDialog
        dictionary={dictionary}
        data={monster}
        open={monsterDialogState}
        setOpen={setMonsterDialogState}
      />
    </React.Fragment>
  );
}
