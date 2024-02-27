"use client";
import React from "react";
import { type FieldApi, useForm } from "@tanstack/react-form";
import { type getDictionary } from "~/app/get-dictionary";
import { type $Enums } from "@prisma/client";
import { type Session } from "next-auth";
import { type Monster, MonsterSchema } from "prisma/generated/zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import CreateMonster from "./create-monster";

export default function PetPageClient(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}) {
  // 怪物数据的初始值
  const defaultMonster: Monster = {
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
  const { dictionary, session } = props;

  return (
    <div>
      
    <React.Fragment>
        <CreateMonster
          dictionary={dictionary}
          session={session}
          defaultMonster={defaultMonster}
        />
    </React.Fragment>
    </div>
  );
}
