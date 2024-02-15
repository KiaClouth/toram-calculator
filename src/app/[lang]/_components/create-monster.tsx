"use client";
import React, { type FormEvent, useState } from "react";
import Image from "next/image";

import { api } from "~/trpc/react";
import type { getDictionary } from "get-dictionary";

import CloudUpload from "~/../public/app-image/icons/Cloud upload.svg";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { type Monster } from "@prisma/client";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";

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
}

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
        const enumsObject = monsterEnums[key as keyof typeof monsterEnums]
        return (
          <fieldset
            key={key}
            className="flex flex-1 basis-full lg:basis-full flex-col gap-1 p-2 text-main-color-100"
          >
            {dictionary.db.models.monster[key as keyof typeof monsterInput]}
            <fieldset className="flex flex-1 flex-col flex-wrap gap-4 lg:flex-row">
              {Object.keys(enumsObject).map((option) => {
                return (
                  <label
                    key={key + option}
                    className="flex cursor-pointer justify-between gap-2 rounded-full border-1.5 border-bg-grey-8 p-2 px-4 text-main-color-100 hover:border-bg-grey-20 lg:flex-row-reverse lg:justify-end"
                  >
                    {dictionary.db.enums[key as keyof typeof enumsObject][option]}
                    <input
                      type="radio"
                      name={key}
                      value={option}
                      onChange={(e) =>
                        inputHandleChange(e, key)
                      }
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
            className="flex basis-1/2 lg:basis-1/4 flex-col gap-1 p-2 text-main-color-100"
          >
            <label className="flex basis-1/4 flex-col gap-1 p-2 text-main-color-100">
              {dictionary.db.models.monster[key as keyof typeof monsterInput]}
              <input
                type={typeof monsterInput[key] === "number" ? Object.keys(inputOption).includes(key) ? inputOption[key as keyof typeof inputOption].type : "number" : "text"}
                name={key}
                min={ Object.keys(inputOption).includes(key) ? inputOption[key as keyof typeof inputOption]?.min : 0}
                max={ Object.keys(inputOption).includes(key) ? inputOption[key as keyof typeof inputOption]?.max : undefined}
                onChange={(e) =>
                  inputHandleChange(e, key)
                }
                className=" mt-1 w-full rounded bg-bg-grey-8 px-4 py-2 text-main-color-100"
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
    (monsterInput[key] as typeof e.target.value | number) = ["number","range"].includes(e.target.type) ? parseInt(e.target.value) : e.target.value;
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
        className={`cloudUpload flex w-12 flex-none cursor-pointer items-center justify-center rounded-full hover:bg-bg-grey-20 ${session?.user ? "" : "hidden"}`}
      >
        <Image
          src={CloudUpload as StaticImport}
          alt="Logo"
          height={24}
          width={24}
          style={{ width: "24px", height: "auto" }}
        />
      </button>
      <div
        className={`FormBoxBg fixed left-0 top-0 flex h-dvh w-dvw flex-col bg-bg-dark-50 ${open}`}
      >
        <div
          onClick={handleUploadClick}
          className="FormCloseBtn h-24 cursor-pointer"
        ></div>
        <div className="FormBoxContent flex h-[91dvh] flex-1 flex-col bg-bg-white-100 lg:items-center">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className={`CreateMonsterFrom flex min-h-full max-w-7xl flex-col gap-4 overflow-y-auto rounded p-4 lg:w-4/5 ${bottom}`}
          >
            <div className="title flex justify-between border-b-1.5 border-brand-color-blue p-3 text-lg font-semibold text-main-color-100">
              <span className=" text-main-color-100">
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
            <div className="functionArea flex justify-end border-t-1.5 border-brand-color-blue py-3">
              <div className="btnGroup flex gap-5">
                <button
                  type="submit"
                  className={`cloudUpload flex h-12 items-center justify-center rounded-full px-6 text-bg-white-100 ${submitBtnState ? " bg-main-color-100 hover:bg-bg-grey-20 hover:text-main-color-100" : " cursor-no-drop bg-main-color-50"}`}
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
