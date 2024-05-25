import React from "react";
import { type Locale } from "~/app/i18n-config";
import { getDictionary } from "~/app/get-dictionary";
import { getServerAuthSession } from "~/server/auth";
import Nav from "../_components/nav";

export default async function EquipmentPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();
  return (
    
    <React.Fragment>
      <Nav dictionary={dictionary} session={session} />
    </React.Fragment>
  );
}
