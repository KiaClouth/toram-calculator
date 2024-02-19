import CrateMonster from "~/app/[lang]/_components/create-monster";
import LongSearchBox from "~/app/[lang]/_components/longSearchBox";
import { api } from "~/trpc/server";
import { getDictionary } from "get-dictionary";
import { type Locale } from "i18n-config";
import { getServerAuthSession } from "~/server/auth";

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
        <div className="ModuleContent flex max-w-[100dvw] flex-1 basis-full flex-col 2xl:basis-[1440px]">
          <div className="Top flex w-full justify-between gap-4 p-5">
            <LongSearchBox dictionary={dictionary} monsterList={monsterList} />
            <CrateMonster dictionary={dictionary} session={session} />
          </div>
          <table className="MonsterList bg-transtion-color-8 dark:bg-transtion-color-8-dark m-5 rounded">
            <caption>Front-end web developer course 2021</caption>
            <thead>
              <tr>
                <th scope="col">Person</th>
                <th scope="col">Most interest in</th>
                <th scope="col">Age</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Chris</th>
                <td>HTML tables</td>
                <td>22</td>
              </tr>
              <tr>
                <th scope="row">Dennis</th>
                <td>Web accessibility</td>
                <td>45</td>
              </tr>
              <tr>
                <th scope="row">Sarah</th>
                <td>JavaScript frameworks</td>
                <td>29</td>
              </tr>
              <tr>
                <th scope="row">Karen</th>
                <td>Web performance</td>
                <td>36</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2}>
                  Average age
                </th>
                <td>33</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="RightArea flex-1"></div>
      </div>
    </main>
  );
}
