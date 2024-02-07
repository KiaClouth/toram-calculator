"use client";
import * as React from "react";
import { ModifiersName, type Monster } from "@prisma/client";
import { type getDictionary } from "get-dictionary";
import { api } from "~/trpc/server";

export default function MonsterDialog(props: {
  dictionary: ReturnType<typeof getDictionary>;
  monsterData: Monster | undefined;
  monsterDialogState: boolean;
  setMonsterDialogState: (state: boolean) => void;
}) {
  const { dictionary, monsterData, monsterDialogState, setMonsterDialogState } =
    props;
  
  // const User = await api.monster.getUserByMonsterId.query(monsterData ? monsterData.updatedById : "")

  function handleCancel(): void {
    setMonsterDialogState(false);
  }

  function handleModify(): void {
    setMonsterDialogState(false);
  }

  const renderContent = (): [string, string | undefined][] => {
    const attrList: [string, string | undefined][] = [];
    for (const attr in monsterData) {
      const monsterAttr = monsterData[attr as keyof Monster]?.toString();
      if (attr === "updatedById") {
        
        attrList.push([attr, ""]);
      }
      if (
        !["id", "updatedAt", "state"].includes(monsterAttr ? monsterAttr : "")
      ) {
        attrList.push([attr, monsterAttr]);
      }
    }
    return attrList;
  };

  return (
    <React.Fragment>
      <div
        onClick={handleCancel}
        className={`DialogBg fixed left-0 top-0 flex h-dvh w-dvw flex-col items-stretch justify-center overflow-y-auto bg-bg-dark-20 ${monsterDialogState ? " visible opacity-100" : " invisible opacity-0"}`}
      >
        <div className="DialogContent flex max-h-dvh flex-col gap-3 bg-bg-white-100 p-4">
          <div className="DialogTitle text-center text-lg font-semibold text-main-color-100">
            {JSON.stringify(monsterData?.name, null, 2)}
          </div>
          <div className="DialogContent overflow-y-auto">
            <div
              className="DialogContentText flex flex-col gap-4 rounded bg-bg-grey-8 p-2"
              id="scroll-dialog-description"
              tabIndex={0}
            >
              {renderContent().map(([key, value]) => {
                return (
                  <div key={key + value} className="Name&Attr">
                    <div className="Name p-2 text-main-color-50">
                      {dictionary.db.monster[key as keyof Monster]}:
                    </div>
                    <div className="Attr bg-bg-grey-8 p-2 text-main-color-100">
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* <div className="DialogActions flex gap-4 justify-end">
            <button
              className="Button flex px-4 py-1 flex-none cursor-pointer items-center justify-center rounded-full text-bg-white-100 bg-main-color-100 hover:bg-main-color-70"
              onClick={handleCancel}
            >
              {dictionary.ui.monster.save}
            </button>
            <button
              className="Button flex px-4 py-2 flex-none cursor-pointer items-center justify-center rounded-full bg-bg-grey-8 hover:bg-bg-grey-20"
              onClick={handleModify}
            >
              {dictionary.ui.monster.modify}
            </button>
          </div> */}
        </div>
      </div>
    </React.Fragment>
  );
}
