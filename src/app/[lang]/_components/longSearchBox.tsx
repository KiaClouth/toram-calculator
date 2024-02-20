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
      <div className="SearchBox z-10 mb-20 lg:mb-0 flex flex-none flex-col-reverse p-4 lg:flex-col">
        <input
          type="search"
          placeholder={"✌" + dictionary.ui.monster.searchPlaceholder}
          list="options"
          className="Search border-b-2 border-transition-color-20 px-5 py-3 placeholder:text-accent-color-50 hover:bg-transition-color-8 focus:border-accent-color-70 focus:outline-none"
          onChange={(e) => handleChange(e.target.value)}
        />
        <div
          id="options"
          className={`Options h-0 flex-col-reverse rounded lg:flex-col ${open}`}
        >
          <div className="OptionsContent mb-4 flex max-h-[60dvh] flex-shrink-0 flex-col overflow-y-auto rounded bg-primary-color p-1 shadow-xl shadow-transition-color-20 backdrop-blur lg:mb-0 lg:mt-4 lg:bg-primary-color-50 lg:p-2 lg:shadow-2xl">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleClick(option.id)}
                tabIndex={0}
                className={`option mx-1 my-0.5 flex gap-1 rounded hover:bg-brand-color-1st`}
              >
                <div className=" basis-1/4 self-stretch break-all bg-transition-color-8 p-2 text-start">
                  {option.name}
                </div>
                <div className=" flex basis-3/4 flex-wrap gap-x-4 self-stretch break-all bg-transition-color-8 p-2 text-start text-accent-color-70">
                  {option.related.map((attr) => {
                    if (attr[0] === "name") return;
                    return (
                      <div
                        key={`${attr[0]}${attr[1]}`}
                        className=" flex flex-wrap gap-1"
                      >
                        <span>
                          {dictionary.db.models.monster[
                            `${attr[0]}` as keyof typeof dictionary.db.models.monster
                          ] ?? "[此属性名在词库中未找到=。=]"}
                          :
                        </span>
                        <span>{attr[1]}</span>
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
