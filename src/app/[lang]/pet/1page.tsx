import { getDictionary } from "~/app/get-dictionary";
import { type Locale } from "~/app/i18n-config";
import { getServerAuthSession } from "~/server/auth";
import PetPageClient from "./client";

export default async function MonsterPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();

  return (
    <PetPageClient dictionary={dictionary} session={session} />
  );
}
