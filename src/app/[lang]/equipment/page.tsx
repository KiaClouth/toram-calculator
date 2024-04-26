import React from "react";
import { type Locale } from "~/app/i18n-config";
import { getDictionary } from "~/app/get-dictionary";
import { getServerAuthSession } from "~/server/auth";
import { sApi } from "~/trpc/server";

export default async function EquipmentPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();
  return (
    <></>
  );
}
