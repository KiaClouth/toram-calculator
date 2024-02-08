"use client";
import * as React from "react";
import { type Monster } from "@prisma/client";
import MonsterDialog from "./monsterDisplay";
import { type getDictionary } from "get-dictionary";

interface Film {
  id: string;
  name: string;
  related: [string, string | undefined][];
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
      const related: [string, string | undefined][] = [];
      for (const attr in monster) {
        if (!["id", "updatedAt", "updatedById", "state"].includes(attr)) {
          const monsterAttr = monster[attr as keyof Monster]?.toString();
          if (monsterAttr?.match(value)?.input !== undefined) {
            related.push([attr, monsterAttr?.match(value)?.input]);
          }
        }
      }
      related.length !== 0 &&
        tempFilm.push({ id: monster.id, name: monster.name, related: related });
    });
    setOptions(tempFilm);
  };

  const handleClick = (id: string) => {
    monsterList.forEach((monster) => {
      if (monster.id !== id) return;
      setMonsteData(monster);
      setMonsterDialogState(true);
    });
  };

  return (
    <React.Fragment>
      <div className="SearchBox z-0 flex-1">
        <input
          type="search"
          placeholder={dictionary.ui.monster.searchPlaceholder}
          list="options"
          className="Search w-full rounded-full bg-bg-grey-8 px-5 py-3 text-main-color-100 placeholder:text-main-color-50 hover:bg-bg-grey-20"
          onChange={(e) => handleChange(e.target.value)}
        />
        <div id="options" className={`Options h-0 flex-col rounded ${open}`}>
          <div className="OptionsContent rounded mt-4 flex max-h-[60dvh] flex-shrink-0 flex-col overflow-y-auto p-2 shadow-bg-grey-20 shadow-2xl bg-bg-white-100">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleClick(option.id)}
                tabIndex={0}
                className={`option mx-1 my-0.5 flex gap-1 rounded hover:bg-brand-color-blue`}
              >
                <div className=" basis-1/4 self-stretch break-all bg-bg-grey-8 p-2 text-start text-main-color-100">
                  {option.name}
                </div>
                <div className=" basis-3/4 self-stretch break-all flex flex-wrap gap-x-4 bg-bg-grey-8 p-2 text-start text-main-color-70">
                  {option.related.map((attr) => {
                    return (
                      <div key={`${attr[0]}${attr[1]}`} className=" flex flex-wrap gap-1">
                        <span>{attr[0]}:</span>
                        <span className=" text-main-color-100">{attr[1]}</span>
                      </div>
                    );
                  })}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <MonsterDialog
        dictionary={dictionary}
        monsterData={monsterData}
        monsterDialogState={monsterDialogState}
        setMonsterDialogState={setMonsterDialogState}
      />
    </React.Fragment>
  );
}
