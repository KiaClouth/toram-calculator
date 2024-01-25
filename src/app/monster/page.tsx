import Link from "next/link";

class Monster {
  lv: number;
  constructor(lv: number) {
    this.lv = lv;
  }
}

export default function MonsterPage() {
  return (
    <main className="w-full h-full flex bg-bg-light-orange">
      <div id="Character">
        <div id="title">
          <div id="mianTitle">Character</div>
          <div id="subTitle">= =</div>
        </div>
        <div id="content">
          <div id="inputModule"></div>
          <div id="outModule"></div>
        </div>
      </div>
    </main>
  );
}
