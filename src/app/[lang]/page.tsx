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
  const monsterList = await sApi.monster.getAll.query();
  const skillList = await sApi.skill.getAll.query();
  // const equipmentList = await sApi.equipment.getAll.query();
  const crystalList = await sApi.crystal.getAll.query();
  // const petList = await sApi.pet.getAll.query();
  // const consumableList = await sApi.consumable.getAll.query();
  // const characterList = await sApi.character.getAll.query();

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
