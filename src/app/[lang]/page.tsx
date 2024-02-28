import { getDictionary } from "~/app/get-dictionary";
import { type Locale } from "~/app/i18n-config";
import ImageBackground from "./_components/bg";
import React, { useState } from "react";
import BabylonBg from "./_components/babylonBg";
import LoadingBox from "./_components/loadingBox";
import IndexClientOage from "./client";
import IndexPageClient from "./client";

export default async function Index({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = getDictionary(lang);
  const now = new Date().getHours();
  let greetings = dictionary.ui.index.goodMorning;
  if (now >= 13 && now < 18) {
    greetings = dictionary.ui.index.goodAfternoon;
  } else if ((now >= 18 && now < 24) || now < 5) {
    greetings = dictionary.ui.index.goodEvening;
  }
  return (
    <React.Fragment>
      <IndexPageClient greetings={greetings} />
    </React.Fragment>
  );
}
