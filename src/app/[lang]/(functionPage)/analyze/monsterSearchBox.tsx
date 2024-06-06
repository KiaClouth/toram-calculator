"use client";
import * as React from "react";
import { type getDictionary } from "~/app/get-dictionary";
import { Monster } from "~/schema/monster";

interface Film {
  id: string;
  name: string;
  related: [string, string | undefined][];
}

export default function LongSearchBox(props: {
  dictionary: ReturnType<typeof getDictionary>;
  monsterList: Monster[];
  setMonster: (m: Monster) => void;
}) {
  const { dictionary, monsterList, setMonster } = props;
  const closeClass = " hidden ";
  const openClass = " flex ";
  const [open, setOpen] = React.useState(closeClass);
  const [options, setOptions] = React.useState<Film[]>([]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const search = (serachKey: string | null) => {
    console.log("开始搜索：" + serachKey);
    if (serachKey === "" || serachKey === null) {
      setOpen(closeClass);
      return;
    }
    setOpen(openClass);
    const tempFilm: Film[] = [];
    const hiddenData: Array<keyof Monster> = [
      "id",
      "updatedAt",
      "updatedByUserId",
      "createdByUserId",
    ];
    monsterList.forEach((monster) => {
      const related: [string, string | undefined][] = [];
      for (const attr in monster) {
        if (!hiddenData.includes(attr as keyof Monster)) {
          const monsterAttr = monster[attr as keyof Monster]?.toString();
          if (monsterAttr?.match(serachKey)?.input !== undefined) {
            related.push([attr, monsterAttr?.match(serachKey)?.input]);
          }
        }
      }
      related.length !== 0 && tempFilm.push({ id: monster.id, name: monster.name, related: related });
    });
    setOptions(tempFilm);
  };

  const handleChange = (value: string) => {
    search(value);
  };

  const handleClick = (id: string) => {
    monsterList.forEach((monster) => {
      if (monster.id !== id) return;
      setMonster(monster);
    });
    setOpen(closeClass);
  };

  return (
    <React.Fragment>
      <div className="SearchBox z-10 w-full flex-1 flex flex-col">
        <input
          ref={inputRef}
          type="search"
          placeholder={dictionary.ui.searchPlaceholder}
          list="options"
          className=" border-b border-transition-color-20 bg-transparent px-5 py-2 backdrop-blur-xl placeholder:text-accent-color-50 hover:border-accent-color-70  focus:border-accent-color-70 focus:outline-none lg:flex-1 lg:font-normal"
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          onClick={() => {
            search(inputRef.current?.value ?? "");
          }}
        />
        <div id="options" className={`Options h-0 flex-col ${open}`}>
          <div className="OptionsContent flex max-h-[70dvh] flex-shrink-0 flex-col overflow-y-auto rounded bg-primary-color p-1 shadow-transition-color-20 backdrop-blur lg:p-2 lg:shadow-xl">
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
                      <div key={`${attr[0]}${attr[1]}`} className=" flex flex-wrap gap-1">
                        <span>
                          {dictionary.db.models.monster[`${attr[0]}` as keyof typeof dictionary.db.models.monster] ??
                            "[此属性名在词库中未找到=。=]"}
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
    </React.Fragment>
  );
}
