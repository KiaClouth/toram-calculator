"use client";
import * as React from "react";
import { type Monster } from "@prisma/client";
import { type getDictionary } from "get-dictionary";

export default function MonsterDialog(props: {
  dictionary: ReturnType<typeof getDictionary>;
  data: Monster | undefined;
  open: boolean;
  setOpen?: (state: boolean) => void;
}) {
  const { dictionary, data, open, setOpen } =
    props;

  // const User = await api.monster.getUserByMonsterId.query(data ? data.updatedById : "")

  function handleCancel(): void {
    setOpen && setOpen(false);
  }

  function handleModify(): void {
    setOpen && setOpen(false);
  }

  const renderContent = (): [string, string | undefined][] => {
    const attrList: [string, string | undefined][] = [];
    for (const attr in data) {
      const monsterAttr = data[attr as keyof Monster]?.toString();
      if (attr === "updatedById") {
        attrList.push([attr, "~"]);
      } else if (!["id", "updatedAt", "state"].includes(attr ? attr : "")) {
        attrList.push([attr, monsterAttr ? monsterAttr : "?"]);
      }
    }
    return attrList;
  };

  return (
    <React.Fragment>
      <div
        className={`DialogBg z-50 fixed left-0 top-0 flex h-dvh w-dvw justify-center flex-col overflow-y-auto bg-accent-color-10 backdrop-blur ${open ? " visible opacity-100" : " invisible opacity-0"}`}
      >
        <div className="DialogContent flex max-h-dvh min-h-[70dvh] flex-col gap-3 bg-primary-color p-4 lg:px-[15%]">
          <div className="DialogTitle border-b-1.5 border-brand-color-1st py-3 flex justify-between">
            <span className="text-lg font-semibold">{data?.name}</span>
            <button
              className="Button flex px-8 py-2 flex-none cursor-pointer items-center justify-center rounded bg-transition-color-8 hover:bg-transition-color-20"
              onClick={handleCancel}
            >
              {dictionary.ui.monster.close}
            </button>
          </div>
          <div className="DialogContent overflow-y-auto">
            <div
              className="DialogContentText flex flex-1 flex-wrap rounded"
              tabIndex={0}
            >
              {renderContent().map(([key, value]) => {
                return (
                  <div key={key + value} className="Name&Attr basis-1/2 lg:basis-1/4 px-2 pb-2 rounded hover:bg-bg-grey-8">
                    <div className="Name p-2 ">
                      {dictionary.db.models.monster[key as keyof Monster]}:
                    </div>
                    <div className="Attr border-bg-grey-20 border-1.5 p-2 rounded">
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="DialogActions flex gap-4 justify-end border-t-1.5 border-brand-color-1st py-3">
            <button
              className="Button flex px-8 py-2 flex-none cursor-pointer items-center justify-center rounded-full text-bg-white-100 bg-main-color-100 hover:bg-main-color-70"
              onClick={handleCancel}
            >
              {dictionary.ui.monster.cancel}
            </button>
            <button
              className="Button flex px-8 py-2 flex-none cursor-pointer items-center justify-center rounded-full bg-bg-grey-8 hover:bg-bg-grey-20"
              onClick={handleModify}
            >
              {dictionary.ui.monster.modify}
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
