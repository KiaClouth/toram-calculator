import { sApi } from "~/trpc/server";
import { getDictionary } from "~/app/get-dictionary";
import { type Locale } from "~/app/i18n-config";
import { getServerAuthSession } from "~/server/auth";
import MonserPageClient from "./client";
import React from "react";
import Nav from "../_components/nav";

export default async function MonsterPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();
  const monsterList = await sApi.monster.getUserVisbleList.query();

  return (
    <React.Fragment>
      <Nav dictionary={dictionary} session={session} />
      <MonserPageClient dictionary={dictionary} session={session} monsterList={monsterList} />
    </React.Fragment>
  );
}
