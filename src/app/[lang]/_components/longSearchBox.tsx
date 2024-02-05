"use client";
import * as React from "react";
import { type Monster } from "@prisma/client";
import MonsterDialog from "./monsterDisplay";
import { type getDictionary } from "get-dictionary";

interface Film {
  id: string;
  name: string;
  related: string;
}

export default function LongSearchBox(props: {
  dictionary: ReturnType<typeof getDictionary>;
  monsterList: Monster[];
}) {
  const { dictionary, monsterList } = props;
  const [monsterData, setMonsteData] = React.useState(monsterList[0]);
  const [monsterDialogState, setMonsterDialogState] = React.useState(false);
  const closeClass = " hidden ";
  const openClass = " flex ";
  const [open, setOpen] = React.useState(closeClass);
  const [options, setOptions] = React.useState<readonly Film[]>([]);

  const handleChange = (value: string) => {
    if (value === "" || value === null) {
      setOpen(closeClass);
      return;
    }
    setOpen(openClass);
    const tempFilm: Film[] = [];
    monsterList.forEach((monster) => {
      let related = "";
      for (const attr in monster) {
        if (!["id", "updatedAt", "updatedById", "state"].includes(attr)) {
          const monsterAttr = monster[attr as keyof Monster]?.toString();
          if (monsterAttr?.match(value)?.input !== undefined) {
            related =
              related + attr + ":" + monsterAttr?.match(value)?.input + ";";
          }
        }
      }
      related !== "" &&
        tempFilm.push({ id: monster.id, name: monster.name, related: related });
    });
    setOptions(tempFilm);
  };

  return (
    <>
      <div className="searchBox flex w-full flex-col lg:flex-col-reverse">
        <div
          id="options"
          className={`max-h-[78dvh] w-full flex-col overflow-y-auto overflow-x-hidden rounded bg-bg-grey-8 p-1 shadow-2xl shadow-bg-grey-20 ${open}`}
        >
          {options.map((option) => (
            <div
              key={option.id}
              tabIndex={0}
              className={`option flex cursor-pointer justify-between rounded p-3 hover:bg-brand-color-blue`}
            >
              <span className=" w-2/5 text-main-color-100 lg:w-1/5">
                {option.name}
              </span>
              <span className=" w-3/5 overflow-x-hidden lg:w-4/5">
                {option.related}
              </span>
            </div>
          ))}
        </div>
        <input
          type="search"
          placeholder={dictionary.ui.monster.searchPlaceholder}
          list="options"
          className="h-fit w-full rounded-full bg-bg-grey-8 px-5 py-3 text-main-color-100 transition placeholder:text-main-color-50 hover:bg-bg-grey-20"
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>

      <MonsterDialog
        dictionary={dictionary}
        monsterData={monsterData}
        monsterDialogState={monsterDialogState}
        setMonsterDialogState={setMonsterDialogState}
      />
    </>
  );
}
