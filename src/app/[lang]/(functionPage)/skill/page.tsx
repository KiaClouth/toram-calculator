import { sApi } from "~/trpc/server";
import { getDictionary } from "~/app/get-dictionary";
import { type Locale } from "~/app/i18n-config";
import { getServerAuthSession } from "~/server/auth";
import SkillPageClient from "./client";
import React from "react";

export default async function CharacterPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();
  const skillList = await sApi.skill.getUserVisbleList.query();

  return (
    <React.Fragment>
      <SkillPageClient session={session} dictionary={dictionary} skillList={skillList} />
    </React.Fragment>
  );
}