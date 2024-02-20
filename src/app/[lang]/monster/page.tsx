import CrateMonster from "~/app/[lang]/_components/create-monster";
import LongSearchBox from "~/app/[lang]/_components/longSearchBox";
import { api } from "~/trpc/server";
import { getDictionary } from "get-dictionary";
import { type Locale } from "i18n-config";
import { getServerAuthSession } from "~/server/auth";
import Table from "../_components/table-monster";

// class Monster {
//   lv: number;
//   constructor(lv: number) {
//     this.lv = lv;
//   }
// }

export default async function MonsterPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = getDictionary(lang);
  const session = await getServerAuthSession();
  const monsterList = await api.monster.getList.query();

  return (
    <main className="Main flex flex-1">
      {/* <div className="Module1 hidden max-w-60 flex-shrink flex-col bg-bg-grey-20 "></div> */}
      <div className="Module2 flex flex-1">
        <div className="LeftArea flex-1"></div>
        <div className="ModuleContent flex max-w-[100dvw] h-dvh flex-1 basis-full flex-col-reverse lg:flex-col 2xl:basis-[1440px]">
          <LongSearchBox dictionary={dictionary} monsterList={monsterList} />
          <Table tableData={monsterList} session={session} />
        </div>
        <div className="RightArea flex-1"></div>
      </div>
    </main>
  );
}
