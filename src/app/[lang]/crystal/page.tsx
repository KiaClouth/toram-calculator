import React from "react";
import CrystalPageClient from "./client";
import { type Locale } from "~/app/i18n-config";
import { getDictionary } from "~/app/get-dictionary";
import { getServerAuthSession } from "~/server/auth";
import { sApi } from "~/trpc/server";
import Nav from "../_components/nav";

export default async function CrystalPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();
  const crystalList = await sApi.crystal.getUserVisbleList.query();
  return (
    <React.Fragment>
      <Nav dictionary={dictionary} session={session} />
      <CrystalPageClient dictionary={dictionary} session={session} crystalList={crystalList} />
    </React.Fragment>
  );
}
