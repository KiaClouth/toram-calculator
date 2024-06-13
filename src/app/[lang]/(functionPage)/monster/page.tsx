import { getDictionary } from "~/app/get-dictionary";
import { type Locale } from "~/app/i18n-config";
import { getServerAuthSession } from "~/server/auth";
import MonserPageClient from "./client";
import React from "react";

export default async function MonsterPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();

  return (
    <React.Fragment>
      <MonserPageClient dictionary={dictionary} session={session} />
    </React.Fragment>
  );
}
