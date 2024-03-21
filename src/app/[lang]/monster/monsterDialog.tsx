"use client";
import * as React from "react";
import { type Monster } from "@prisma/client";
import { type getDictionary } from "~/app/get-dictionary";

export default function MonsterDialog(props: {
  dictionary: ReturnType<typeof getDictionary>;
  data: Monster | undefined;
  open: boolean;
  setOpen?: (state: boolean) => void;
}) {
  const { dictionary, data, open, setOpen } = props;

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
        className={`DialogBg fixed left-0 top-0 z-50 flex h-dvh w-dvw flex-col justify-center overflow-y-auto bg-accent-color-10 backdrop-blur ${open ? " visible opacity-100" : " invisible opacity-0"}`}
      >
        <div className="DialogContent flex max-h-dvh min-h-[70dvh] flex-col gap-3 bg-primary-color p-4 lg:px-[15%]">
          <div className="DialogTitle flex justify-between border-b-1.5 border-brand-color-1st py-3">
            <span className="text-lg font-semibold">{data?.name}</span>
            <button
              className="Button flex flex-none cursor-pointer items-center justify-center rounded bg-transition-color-8 px-8 py-2 hover:bg-transition-color-20"
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
                  <div
                    key={key + value}
                    className="Name&Attr hover:bg-bg-grey-8 basis-1/2 rounded px-2 pb-2 lg:basis-1/4"
                  >
                    <div className="Name p-2 ">
                      {dictionary.db.models.monster[key as keyof Monster]}:
                    </div>
                    <div className="Attr border-bg-grey-20 rounded border-1.5 p-2">
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="DialogActions flex justify-end gap-4 border-t-1.5 border-brand-color-1st py-3">
            <button
              className="Button text-bg-white-100 bg-main-color-100 hover:bg-main-color-70 flex flex-none cursor-pointer items-center justify-center rounded-full px-8 py-2"
              onClick={handleCancel}
            >
              {dictionary.ui.monster.cancel}
            </button>
            <button
              className="Button bg-bg-grey-8 hover:bg-bg-grey-20 flex flex-none cursor-pointer items-center justify-center rounded-full px-8 py-2"
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
