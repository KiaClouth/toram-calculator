import type { $Enums, Monster } from "@prisma/client";

// 为了方便编辑器自动补全，这个方法可以将数据库模型的值类型转换为字符串
type ConvertToAllString<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends Date | Date[]
        ? string
        : ConvertToAllString<T[K]>;
    }
  : string;

interface dictionary {
  ui: {
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
    };
  };
}
