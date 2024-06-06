import React from "react";
import CharacterPageClient from "./client";
import { type Locale } from "~/app/i18n-config";
import { getDictionary } from "~/app/get-dictionary";
import { getServerAuthSession } from "~/server/auth";
import { sApi } from "~/trpc/server";

export default async function CharacterPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();
  const characterList = await sApi.character.getAll.query();
  return (
    <React.Fragment>
      <CharacterPageClient dictionary={dictionary} session={session} characterList={characterList} />
    </React.Fragment>
  );
}
