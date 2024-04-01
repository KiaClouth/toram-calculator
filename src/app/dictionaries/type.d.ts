import { type $Enums, type Monster } from "@prisma/client";

type ConvertToAllString<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends Date ? string : ConvertToAllString<T[K]>;
    }
  : string;

interface dictionary {
  ui: {
    root: {
      home: string,
      monsters: string,
      skills: string,
      equipments: string,
      crystas: string,
      pets: string,
      items: string,
      character: string,
      comboAnalyze: string,
    },
    index: {
      goodMorning: string,
      goodAfternoon: string,
      goodEvening: string,
    },
    monster: {
      pageTitle: string,
      discription: string,
      searchPlaceholder: string,
      upload: string,
      save: string,
      reset: string,
      modify: string,
      cancel: string,
      close: string,
      filter: string,
      columnsHidden: string,
    },
  },
  db: {
    enums: ConvertToAllString<typeof $Enums>;
    models: {
      monster: ConvertToAllString<Monster>;
    };
  };
}