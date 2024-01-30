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
  const closeClass = " invisible opacity-0 pointer-events-none ";
  const openClass = " visible opacity-100 pointer-events-auto ";
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
      <div
        // onBlur={() => {
        //   setOpen(closeClass);
        // }}
        className="searchBox flex flex-col w-full gap-1"
      >
        <input
          type="search"
          placeholder={dictionary.ui.monster.searchPlaceholder}
          list="options"
          className="hover:bg-bg-grey-20 w-full flex-1 rounded-full bg-bg-grey-8 px-5 py-3 text-main-color-100 transition placeholder:text-main-color-50"
          onChange={(e) => handleChange(e.target.value)}
        />
        <div
          id="options"
          className={`max-h-[80dvh] w-full rounded overflow-y-auto bg-bg-grey-8 p-1 shadow-bg-grey-20 shadow-2xl ${open}`}
        >
          {options.map((option) => (
            <div
              key={option.id}
              tabIndex={0}
              className={`option flex justify-between cursor-pointer rounded p-3 hover:bg-brand-color-blue`}
            >
              <span className=" text-main-color-100 w-2/5 lg:w-1/5">
                {option.name}
              </span>
              <span className=" w-3/5 lg:w-4/5 overflow-x-hidden">{option.related}</span>
            </div>
          ))}
        </div>
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
