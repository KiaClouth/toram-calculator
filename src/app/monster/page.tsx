import Link from "next/link";
import CrateMonster from "~/app/_components/create-monster";
import LongSearchBox from "~/app/_components/longSearchBox";

class Monster {
  lv: number;
  constructor(lv: number) {
    this.lv = lv;
  }
}


export default function MonsterPage() {
  return (
    <main className="main w-full flex">
      <div className="module2 h-full min-h-dvh w-full flex flex-col bg-brand-color-blue">
        <LongSearchBox />
        <CrateMonster />
        <div className="List"></div>
      </div>
    </main>
  );
}
