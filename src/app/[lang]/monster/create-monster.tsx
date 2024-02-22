"use client";
import React, { type FormEvent, useState } from "react";

import { api } from "~/trpc/react";
import type { getDictionary } from "get-dictionary";

import { type Monster } from "@prisma/client";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { IconCloudUpload } from "../_components/iconsList";
import Button from "../_components/button";

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
  defaultMonster: Monster;
}) {
  const router = useRouter();
  const { dictionary, session, defaultMonster } = props;
  const monsterEnums = dictionary.db.enums;
  const [open, setOpen] = useState("invisible");
  const [bottom, setBottom] = useState("translate-y-1/2");
  const [submitBtnState, setSubmitState] = useState(false);

  const createMonster = api.monster.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const inputAttr = (key: keyof typeof defaultMonster) => {
    if (["id", "updatedAt", "updatedById", "createdByUserId", "state"].includes(key)) {
      return;
    } else {
      if (Object.keys(monsterEnums).includes(key)) {
        const enumsObject = monsterEnums[key as keyof typeof monsterEnums];
        return (
          <fieldset
            key={key}
            className="flex flex-1 basis-full flex-col gap-1 p-2 lg:basis-full"
          >
            {dictionary.db.models.monster[key as keyof typeof defaultMonster]}
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
              {dictionary.db.models.monster[key as keyof typeof defaultMonster]}
              <input
                type={
                  typeof defaultMonster[key] === "number"
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
    key: keyof typeof defaultMonster,
  ) => {
    (defaultMonster[key] as typeof e.target.value | number) = [
      "number",
      "range",
    ].includes(e.target.type)
      ? parseInt(e.target.value)
      : e.target.value;
    // console.log(typeof defaultMonster[key])
    if (e.target.name === "name" && e.target.value === "") {
      setSubmitState(false);
    } else {
      defaultMonster.name !== "" && setSubmitState(true);
    }
    // console.log(e.target.name, defaultMonster[key], defaultMonster);
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
    console.log(defaultMonster)
    createMonster.mutate(defaultMonster);
  };

  return (
    <React.Fragment>
      {session?.user ? (
        <Button
          onClick={handleUploadClick}
          content={dictionary.ui.monster.upload}
          icon={<IconCloudUpload />}
        />
      ) : (
        ""
      )}
      <div
        className={`FormBoxBg fixed left-0 top-0 z-10 flex h-dvh w-dvw flex-col bg-transition-color-20 backdrop-blur ${open}`}
      >
        <div
          onClick={handleUploadClick}
          className="FormCloseBtn h-24 cursor-pointer"
        ></div>
        <div className="FormBoxContent flex h-[91dvh] flex-1 flex-col bg-primary-color lg:items-center">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className={`CreateMonsterFrom flex max-w-7xl flex-col gap-4 overflow-y-auto rounded p-4 lg:w-4/5 ${bottom}`}
          >
            <div className="title flex justify-between border-b-1.5 border-brand-color-1st p-3 text-lg font-semibold">
              <span>{dictionary.ui.monster.upload}</span>
            </div>
            <div className="inputArea flex-1 overflow-y-auto">
              <fieldset className="dataKinds flex flex-wrap lg:flex-row">
                {Object.keys(defaultMonster).map((key) =>
                  inputAttr(key as keyof typeof defaultMonster),
                )}
              </fieldset>
            </div>
            <div className="functionArea flex justify-end border-t-1.5 border-brand-color-1st py-3">
              <div className="btnGroup flex gap-5">
                <Button
                  type="submit"
                  content={
                    createMonster.isLoading
                      ? `${dictionary.ui.monster.upload}...`
                      : `${dictionary.ui.monster.upload}`
                  }
                  disabled={createMonster.isLoading || !submitBtnState}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}
