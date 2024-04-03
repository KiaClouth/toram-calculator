import React from "react";
import { type Locale } from "~/app/i18n-config";
import { getDictionary } from "~/app/get-dictionary";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import SkillPageClient from "./client";

export default async function CharacterPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();
  const skillList = await api.skill.getUserVisbleList.query();

  return (
    <SkillPageClient session={session} dictionary={dictionary} skillList={skillList} />
  );
}
