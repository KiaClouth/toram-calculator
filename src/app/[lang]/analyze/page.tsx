import { sApi } from "~/trpc/server";
import { getDictionary } from "~/app/get-dictionary";
import { type Locale } from "~/app/i18n-config";
import { getServerAuthSession } from "~/server/auth";
import AnalyzePageClient from "./client";

export default async function MonsterPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();
  const monsterList = await sApi.monster.getUserVisbleList.query();

  return (
    <AnalyzePageClient
      dictionary={dictionary}
      session={session}
    />
  );
}
