import CrateMonster from "~/app/[lang]/_components/create-monster";
import LongSearchBox from "~/app/[lang]/_components/longSearchBox";
import { api } from "~/trpc/server";
import { getDictionary } from "get-dictionary";
import { type Locale } from "i18n-config";

// class Monster {
//   lv: number;
//   constructor(lv: number) {
//     this.lv = lv;
//   }
// }

export default async function MonsterPage({params: {lang}}: {params: { lang: Locale }}) {
  const dictionary = getDictionary(lang);
  const monsterList = await api.monster.getList.query();
  return (
    <main className="main flex w-full">
      <div className="module2 flex h-full w-full flex-col items-center">
        <div className="moduleContent min-h-dvh w-full max-w-8xl">
          <div className="w-full p-5 flex flex-col lg:flex-row gap-4">
            <LongSearchBox dictionary={dictionary} monsterList={monsterList} />
            {/* <CrateMonster dictionary={dictionary} /> */}
          </div>
          <div className="List"></div>
        </div>
      </div>
    </main>
  );
}
