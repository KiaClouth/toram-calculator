import CrateMonster from "~/app/[lang]/_components/create-monster";
import LongSearchBox from "~/app/[lang]/_components/longSearchBox";
import { api } from "~/trpc/server";
import { getDictionary } from "get-dictionary";
import { type Locale } from "i18n-config";
import { map } from "@trpc/server/observable";

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
  const monsterList = await api.monster.getList.query();
  return (
    <main className="Main flex flex-1">
      {/* <div className="Module1 hidden max-w-60 flex-shrink flex-col bg-bg-grey-20 "></div> */}
      <div className="Module2 flex flex-1">
        <div className="LeftArea flex-1"></div>
        <div className="ModuleContent flex-1 max-w-[100dvw] basis-full 2xl:basis-[1440px]">
          <div className="Top flex justify-between w-full p-5">
            <LongSearchBox dictionary={dictionary} monsterList={monsterList} />
            <CrateMonster dictionary={dictionary} />
          </div>
          <div className="List flex flex-col">
          </div>
        </div>
        <div className="RightArea flex-1"></div>
      </div>
    </main>
  );
}
