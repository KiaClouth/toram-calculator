import Link from "next/link";
import CrateMonster from "~/app/_components/create-monster";
import LongSearchBox from "~/app/_components/longSearchBox";
import { api } from "~/trpc/server";
import { CreatePost } from "../_components/create-post";

class Monster {
  lv: number;
  constructor(lv: number) {
    this.lv = lv;
  }
}

const monsterList = await api.monster.getList.query();

export default function MonsterPage() {
  return (
    <main className="main w-full flex">
      <div className="module2 h-full min-h-dvh w-full flex flex-col bg-brand-color-blue">
        <LongSearchBox
          topFilms={monsterList.map((monster) => {
            if (typeof monster.baseLv === "number") {
              return { name: monster.name, baseLv: monster.baseLv };
            } else {
              return { name: monster.name, baseLv: 0 };
            }
          })}
        />
        <CreatePost />
        <CrateMonster />
        <div className="List"></div>
      </div>
    </main>
  );
}
