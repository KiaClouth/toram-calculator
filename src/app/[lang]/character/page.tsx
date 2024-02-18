import Link from "next/link";

const variableBonus = {
  strR: 0,
  strV: 0,
  intR: 0,
  intV: 0,
  vitR: 0,
  vitV: 0,
  agiR: 0,
  agiV: 0,
  dexR: 0,
  dexV: 0,
  pAtkR: 0,
  pAtkV: 0,
  mAtkR: 0,
  mAtkV: 0,
  weaAtkR: 0,
  weaAtkV: 0,
  pPie: 0,
  mPie: 0,
  cdR: 0,
  cdV: 0,
  crR: 0,
  crV: 0,
  cdT: 0,
  crT: 0,
  stro: 0,
  dis: 0,
  pStab: 0,
  mStab: 0,
  total: 0,
  final: 0,
  aspdr: 0,
  aspdv: 0,
  cspdr: 0,
  cspdv: 0,
  am: 0,
};
type variableBonusType = typeof variableBonus;
type bonus = keyof variableBonusType;
type permanentSkill = {
  name: string;
  state: boolean;
  effectList: Partial<Record<bonus, number>>;
};
type element = "无属性" | "水属性" | "火属性" | "地属性" | "风属性" | "光属性" | "暗属性";
type abi = {
  str: number;
  int: number;
  vit: number;
  agi: number;
  dex: number;
};
type weaType = {
  单手剑: {
    baseHit: 0.25;
    baseAspd: 100;
    convert: {
      str: {
        patk: 2;
        stab: 0.025;
        aspd: 0.2;
      };
      int: {
        matk: 3;
      };
      agi: {
        aspd: 4.2;
      };
      dex: {
        patk: 2;
        stab: 0.075;
      };
    };
  };
  拔刀剑: {
    baseHit: 0.3;
    baseAspd: 200;
    convert: {
      str: {
        patk: 1.5;
        stab: 0.075;
        aspd: 0.3;
      };
      int: {
        matk: 1.5;
      };
      agi: {
        aspd: 3.9;
      };
      dex: {
        patk: 2.5;
        stab: 0.025;
      };
    };
  };
  大剑: {
    baseHit: 0.15;
    baseAspd: 50;
    convert: {
      str: {
        patk: 3;
        aspd: 0.2;
      };
      int: {
        matk: 3;
      };
      agi: {
        aspd: 2.2;
      };
      dex: {
        patk: 1;
        stab: 0.1;
      };
    };
  };
  弓: {
    baseHit: 0.1;
    baseAspd: 75;
    convert: {
      str: {
        patk: 1;
        stab: 0.05;
      };
      int: {
        matk: 3;
      };
      agi: {
        aspd: 3.1;
      };
      dex: {
        patk: 3;
        stab: 0.05;
        aspd: 0.2;
      };
    };
  };
  弩: {
    baseHit: 0.05;
    baseAspd: 100;
    convert: {
      str: {
        stab: 0.05;
      };
      int: {
        matk: 3;
      };
      agi: {
        aspd: 2.2;
      };
      dex: {
        patk: 4;
        aspd: 0.2;
      };
    };
  };
  杖: {
    baseHit: 0.3;
    baseAspd: 60;
    convert: {
      str: {
        patk: 3;
        stab: 0.05;
      };
      int: {
        matk: 4;
        patk: 1;
        aspd: 0.2;
      };
      agi: {
        aspd: 1.8;
      };
      dex: {
        aspd: 0.2;
      };
    };
  };
  魔导: {
    baseHit: 0.1;
    baseAspd: 90;
    convert: {
      int: {
        matk: 4;
        padtk: 2;
        aspd: 0.2;
      };
      agi: {
        padtk: 2;
        aspd: 4;
      };
      dex: {
        stab: 0.1;
      };
    };
  };
  拳: {
    baseHit: 0.1;
    baseAspd: 100;
    convert: {
      str: {
        aspd: 0.1;
      };
      int: {
        matk: 4;
      };
      agi: {
        patk: 2;
        aspd: 4.6;
      };
      dex: {
        patk: 0.5;
        stab: 0.025;
      };
    };
  };
  枪: {
    baseHit: 0.25;
    baseAspd: 20;
    convert: {
      str: {
        patk: 2.5;
        stab: 0.05;
        aspd: 0.2;
      };
      int: {
        matk: 2;
      };
      agi: {
        aspd: 3.5;
        patk: 1.5;
        matk: 1;
      };
      dex: {
        stab: 0.05;
      };
    };
  };
};
type weatypeName = keyof weaType;
type wea = {
  type: weatypeName;
  baseAtk: number;
  stab: number;
  refv: number;
  dte: element;
};
type permanentSkillList = permanentSkill[];
class Character {
  lv: number;
  abi: abi;
  wea: wea;
  permanentSkillList: permanentSkillList;
  constructor(lv: number, abi: abi, wea: wea, permanentSkillList: permanentSkillList) {
    this.lv = lv;
    this.abi = abi;
    this.wea = wea;
    this.permanentSkillList = permanentSkillList;
  }
}

export default function CharacterPage() {
  const cLv = 1;
  const cAbi: abi = {
    str: 1,
    int: 415,
    vit: 1,
    agi: 1,
    dex: 247,
  };
  const cWeapon: wea = {
    type: "魔导",
    baseAtk: 320,
    stab: 60,
    refv: 15,
    dte: "光属性",
  };
  const cPermanentSkillList: permanentSkillList = [
    {
      name: "魔法要领",
      state: true,
      effectList: {
        mAtkR: 3,
        weaAtkR: 3,
      },
    },
    {
      name: "远程狙击",
      state: true,
      effectList: {
        total: 10,
      },
    },
  ];
  const character = new Character(cLv, cAbi, cWeapon, cPermanentSkillList);
  return (
    <div className="Character flex flex-1 flex-col bg-brand-color-2nd">
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
    </div>
  );
}
