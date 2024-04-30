import type { $Enums, User } from "@prisma/client";
import type { Monster } from "~/server/api/routers/monster";
import type { Skill } from "~/server/api/routers/skill";

// 为了方便编辑器自动补全，这个方法可以将数据库模型的值类型转换为字符串
type ConvertToAllString<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends Date | Date[] | Array<object>
        ? string
        : ConvertToAllString<T[K]>;
    }
  : string;

interface dictionary {
  ui: {
    add: string;
    create: string;
    remove: string;
    upload: string;
    update: string;
    save: string;
    reset: string;
    modify: string;
    cancel: string;
    open: string;
    close: string;
    root: {
      home: string;
      monsters: string;
      skills: string;
      equipments: string;
      crystas: string;
      pets: string;
      items: string;
      character: string;
      comboAnalyze: string;
    };
    index: {
      goodMorning: string;
      goodAfternoon: string;
      goodEvening: string;
    };
    monster: {
      pageTitle: string;
      discription: string;
      searchPlaceholder: string;
      filter: string;
      columnsHidden: string;
      augmented: string;
      monsterDegreeOfDifficulty: {
        0: string;
        1: string;
        2: string;
        3: string;
        4: string;
      }
      monsterForm: {
        discription: string;
      }
    };
    skill: {
      pageTitle: string;
      discription: string;
      searchPlaceholder: string;
      upload: string;
      save: string;
      reset: string;
      modify: string;
      cancel: string;
      close: string;
      filter: string;
      columnsHidden: string;
    };
  };
  db: {
    enums: ConvertToAllString<typeof $Enums>;
    models: {
      monster: ConvertToAllString<Monster>;
      skill: ConvertToAllString<Skill>;
      skillEffect: ConvertToAllString<Skill["skillEffect"][0]>
      skillCost: ConvertToAllString<Skill["skillEffect"][0]["skillCost"][0]>
      skillYield: ConvertToAllString<Skill["skillEffect"][0]["skillYield"][0]>
      user: ConvertToAllString<User>
    };
  };
}
