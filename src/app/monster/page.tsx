import Link from "next/link";
import { useEffect } from "react";
import CrateMonster from "~/app/_components/create-monster";
import LongSearchBox from "~/app/_components/longSearchBox";

class Monster {
  lv: number;
  constructor(lv: number) {
    this.lv = lv;
  }
}

export default function MonsterPage() {
  useEffect(() => {
    console.log("monster被渲染了一次")
  },[])

  return (
    <main className="main flex w-full">
      <div className="module2 flex h-full w-full flex-col items-center">
        <div className="moduleContent max-w-8xl min-h-dvh w-full">
          <LongSearchBox />
          <CrateMonster />
          <div className="List"></div>
        </div>
      </div>
    </main>
  );
}
