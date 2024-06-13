import { getDictionary } from "~/app/get-dictionary";
import { type Locale } from "~/app/i18n-config";
import React from "react";
import { getServerAuthSession } from "~/server/auth"
import IndexPageClient from "./client";
import RandomBallBackground from "./_components/randomBallBg";
import Filing from "./_components/filing";

export default async function Index({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();

  return (
    <React.Fragment>
      <IndexPageClient
        session={session}
        dictionary={dictionary}
      />
      <Filing />
      <RandomBallBackground />
    </React.Fragment>
  );
}
