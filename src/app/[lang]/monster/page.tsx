import { api } from "~/trpc/server";
import { getDictionary } from "~/app/get-dictionary";
import { type Locale } from "~/app/i18n-config";
import { getServerAuthSession } from "~/server/auth";
import MonserPageClient from "./client";

export default async function MonsterPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();
  const monsterList = session?.user.id
  ? [
      ...(await api.monster.getPublicList.query()),
      ...(await api.monster.getPrivateList.query()),
    ]
  : await api.monster.getPublicList.query();

  return (
    <MonserPageClient
      dictionary={dictionary}
      session={session}
      monsterList={monsterList}
    />
  );
}
