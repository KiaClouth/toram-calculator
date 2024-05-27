import { getDictionary } from "~/app/get-dictionary";
import { type Locale } from "~/app/i18n-config";
import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { sApi } from "~/trpc/server";
import IndexPageClient from "./client";
import RandomBallBackground from "./_components/randomBallBg";
import Filing from "./_components/filing";

export default async function Index({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();
  const monsterList = await sApi.monster.getUserVisbleList.query();
  const skillList = await sApi.skill.getUserVisbleList.query();
  // const equipmentList = await sApi.equipment.getUserVisbleList.query();
  const crystalList = await sApi.crystal.getUserVisbleList.query();
  // const petList = await sApi.pet.getUserVisbleList.query();
  // const consumableList = await sApi.consumable.getUserVisbleList.query();
  // const characterList = await sApi.character.getUserVisbleList.query();

  return (
    <React.Fragment>
      <IndexPageClient
        session={session}
        dictionary={dictionary}
        monsterList={monsterList}
        skillList={skillList}
        crystalList={crystalList}
      />
      <Filing />
      <RandomBallBackground />
    </React.Fragment>
  );
}
