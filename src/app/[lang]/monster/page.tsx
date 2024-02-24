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
  const monsterList = await api.monster.getList.query();

  return (
    <MonserPageClient dictionary={dictionary} session={session} monsterList={monsterList} />
  );
}
