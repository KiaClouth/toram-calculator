import React from "react";
import { type Locale } from "~/app/i18n-config";
import Nav from "../_components/nav";
import { getServerAuthSession } from "~/server/auth";
import { getDictionary } from "~/app/get-dictionary";

export default async function FunctionPagesRootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();
  return (
    <React.Fragment>
      <Nav dictionary={dictionary} session={session} />
      {children}
    </React.Fragment>
  );
}
