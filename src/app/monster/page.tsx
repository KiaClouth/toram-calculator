import CrateMonster from "~/app/_components/create-monster";
import LongSearchBox from "~/app/_components/longSearchBox";
import { api } from "~/trpc/server";

// class Monster {
//   lv: number;
//   constructor(lv: number) {
//     this.lv = lv;
//   }
// }

export default async function MonsterPage() {
  const monsterList = await api.monster.getList.query();
  return (
    <main className="main flex w-full">
      <div className="module2 flex h-full w-full flex-col items-center">
        <div className="moduleContent min-h-dvh w-full max-w-8xl">
          <div className="w-full p-5 flex flex-col lg:flex-row gap-4">
            <LongSearchBox monsterList={monsterList} />
            <CrateMonster />
          </div>
          <div className="List"></div>
        </div>
      </div>
    </main>
  );
}
