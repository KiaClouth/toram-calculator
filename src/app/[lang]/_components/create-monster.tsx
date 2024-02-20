"use client";
import React, { type FormEvent, useState } from "react";

import { api } from "~/trpc/react";
import type { getDictionary } from "get-dictionary";

import { type Monster } from "@prisma/client";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { IconCloudUpload } from "./iconsList";

// 怪物数据的初始值
const monsterInput: Monster = {
  id: "",
  updatedAt: new Date(),
  updatedById: "",
  state: "PRIVATE",
  name: "",
  type: "COMMON_BOSS",
  baseLv: 0,
  experience: 0,
  address: "",
  element: "NO_ELEMENT",
  radius: 1,
  maxhp: 0,
  physicalDefense: 0,
  physicalResistance: 0,
  magicalDefense: 0,
  magicalResistance: 0,
  criticalResistance: 0,
  avoidance: 0,
  dodge: 0,
  block: 0,
  normalAttackResistanceModifier: 0,
  physicalAttackResistanceModifier: 0,
  magicalAttackResistanceModifier: 0,
  difficultyOfTank: 0,
  difficultyOfMelee: 0,
  difficultyOfRanged: 0,
  possibilityOfRunningAround: 0,
  specialBehavior: "",
};

// 非string的属性配置
const inputOption = {
  difficultyOfTank: {
    type: "range",
    min: 0,
    max: 10,
  },
  difficultyOfMelee: {
    type: "range",
    min: 0,
    max: 10,
  },
  difficultyOfRanged: {
    type: "range",
    min: 0,
    max: 10,
  },
  possibilityOfRunningAround: {
    type: "range",
    min: 0,
    max: 10,
  },
};

export default function CreateMonster(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}) {
  const router = useRouter();
  const { dictionary, session } = props;
  const monsterEnums = dictionary.db.enums;
  const [open, setOpen] = useState("invisible");
  const [bottom, setBottom] = useState("translate-y-1/2");
  const [submitBtnState, setSubmitState] = useState(false);

  const createMonster = api.monster.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const inputAttr = (key: keyof typeof monsterInput) => {
    if (["id", "updatedAt", "updatedById", "state"].includes(key)) {
      return;
    } else {
      if (Object.keys(monsterEnums).includes(key)) {
        const enumsObject = monsterEnums[key as keyof typeof monsterEnums];
        return (
          <fieldset
            key={key}
            className="flex flex-1 basis-full flex-col gap-1 p-2 lg:basis-full"
          >
            {dictionary.db.models.monster[key as keyof typeof monsterInput]}
            <fieldset className="flex flex-1 flex-col flex-wrap gap-4 lg:flex-row">
              {Object.keys(enumsObject).map((option) => {
                return (
                  <label
                    key={key + option}
                    className=" flex cursor-pointer justify-between gap-2 rounded-full border-1.5 border-transition-color-8 p-2 px-4 hover:border-transition-color-20 lg:flex-row-reverse lg:justify-end"
                  >
                    {
                      dictionary.db.enums[key as keyof typeof enumsObject][
                        option
                      ]
                    }
                    <input
                      type="radio"
                      name={key}
                      value={option}
                      onChange={(e) => inputHandleChange(e, key)}
                    />
                  </label>
                );
              })}
            </fieldset>
          </fieldset>
        );
      } else {
        return (
          <fieldset
            key={key}
            className="flex basis-1/2 flex-col gap-1 p-2 lg:basis-1/4"
          >
            <label className="flex basis-1/4 flex-col gap-1 p-2">
              {dictionary.db.models.monster[key as keyof typeof monsterInput]}
              <input
                type={
                  typeof monsterInput[key] === "number"
                    ? Object.keys(inputOption).includes(key)
                      ? inputOption[key as keyof typeof inputOption].type
                      : "number"
                    : "text"
                }
                name={key}
                min={
                  Object.keys(inputOption).includes(key)
                    ? inputOption[key as keyof typeof inputOption]?.min
                    : 0
                }
                max={
                  Object.keys(inputOption).includes(key)
                    ? inputOption[key as keyof typeof inputOption]?.max
                    : undefined
                }
                onChange={(e) => inputHandleChange(e, key)}
                className=" mt-1 rounded bg-transition-color-8 px-4 py-2"
              />
            </label>
          </fieldset>
        );
      }
    }
  };

  const inputHandleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof monsterInput,
  ) => {
    (monsterInput[key] as typeof e.target.value | number) = [
      "number",
      "range",
    ].includes(e.target.type)
      ? parseInt(e.target.value)
      : e.target.value;
    // console.log(typeof monsterInput[key])
    if (e.target.name === "name" && e.target.value === "") {
      setSubmitState(false);
    } else {
      monsterInput.name !== "" && setSubmitState(true);
    }
    // console.log(e.target.name, monsterInput[key], monsterInput);
  };

  const handleUploadClick = () => {
    if (open.includes("invisible")) {
      setOpen("opacity-1");
      setBottom("translate-y-0");
    } else {
      setOpen("invisible opacity-0");
      setBottom("translate-y-1/2");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMonster.mutate(monsterInput);
  };

  return (
    <React.Fragment>
      <button
        onClick={handleUploadClick}
        className={`cloudUpload hover:bg-transition-color-20 flex w-12 flex-none cursor-pointer items-center justify-center rounded-full ${session?.user ? "" : "hidden"}`}
      >
        <IconCloudUpload />
      </button>
      <div
        className={`FormBoxBg bg-transition-color-20 backdrop-blur fixed z-10 left-0 top-0 flex h-dvh w-dvw flex-col ${open}`}
      >
        <div
          onClick={handleUploadClick}
          className="FormCloseBtn h-24 cursor-pointer"
        ></div>
        <div className="FormBoxContent bg-primary-color flex h-[91dvh] flex-1 flex-col lg:items-center">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className={`CreateMonsterFrom flex max-w-7xl flex-col gap-4 overflow-y-auto rounded p-4 lg:w-4/5 ${bottom}`}
          >
            <div className="title border-brand-color-1st flex justify-between border-b-1.5 p-3 text-lg font-semibold">
              <span>
                {dictionary.ui.monster.upload}
              </span>
            </div>
            <div className="inputArea flex-1 overflow-y-auto">
              <fieldset className="dataKinds flex flex-wrap lg:flex-row">
                {Object.keys(monsterInput).map((key) =>
                  inputAttr(key as keyof typeof monsterInput),
                )}
              </fieldset>
            </div>
            <div className="functionArea border-brand-color-1st flex justify-end border-t-1.5 py-3">
              <div className="btnGroup flex gap-5">
                <button
                  type="submit"
                  className={`cloudUpload flex h-12 items-center justify-center rounded-full px-6 ${submitBtnState ? " bg-accent-color text-primary-color hover:bg-accent-color-80" : " bg-accent-color-30 cursor-no-drop"}`}
                  disabled={createMonster.isLoading || !submitBtnState}
                >
                  {createMonster.isLoading
                    ? `${dictionary.ui.monster.upload}...`
                    : `${dictionary.ui.monster.upload}`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}
