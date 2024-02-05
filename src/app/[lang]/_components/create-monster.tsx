"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import Image from "next/image";

import { api } from "~/trpc/react";
import { getDictionary } from "get-dictionary";

import CloudUpload from "~/../public/app-image/icons/Cloud upload.svg";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Element, Monster, MonsterType, State } from "@prisma/client";

export default function CreateMonster(props: {
  dictionary: ReturnType<typeof getDictionary>;
}) {
  const { dictionary } = props;
  const [open, setOpen] = useState("invisible");
  const [bottom, setBottom] = useState("translate-y-1/2");
  const [submitBtnState, setSubmitState] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<MonsterType>("COMMON_MOBS");
  const [state, setState] = useState<State>("PRIVATE");
  const [element, setElement] = useState<Element>("NO_ELEMENT");
  const [baseLv, setBaseLv] = useState(0);
  const [experience, setExperience] = useState(0);
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState(1);
  const [maxhp, setMaxhp] = useState(0);
  const [physicalDefense, setPhysicalDefense] = useState(0);
  const [physicalResistance, setPhysicalResistance] = useState(0);
  const [magicalDefense, setMagicalDefense] = useState(0);
  const [magicalResistance, setMagicalResistance] = useState(0);
  const [criticalResistance, setCriticalResistance] = useState(0);
  const [avoidance, setAvoidance] = useState(0);
  const [dodge, setDodge] = useState(0);
  const [block, setBlock] = useState(0);
  const [difficultyOfTank, setDifficultyOfTank] = useState(5);
  const [difficultyOfMelee, setDifficultyOfMelee] = useState(5);
  const [difficultyOfRanged, setDifficultyOfRanged] = useState(5);
  const [possibilityOfRunningAround, setPossibilityOfRunningAround] =
    useState(5);

  const createMonster = api.monster.create.useMutation({
    onSuccess: () => {
      document.forms[0]?.reset();
    },
  });

  const handleUploadClick = () => {
    if (open.includes("invisible")) {
      setOpen("opacity-1");
      setBottom("translate-y-0");
    } else {
      setOpen("invisible opacity-0");
      setBottom("translate-y-1/2");
    }
  };

  const nameHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (e.target.value === "") {
      setSubmitState(false)
    } else {
      setSubmitState(true)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMonster.mutate({
      name: name,
      type: type,
      state: state,
      element: element,
      baseLv: baseLv,
      experience: experience,
      address: address,
      radius: radius,
      maxhp: maxhp,
      physicalDefense: physicalDefense,
      physicalResistance: physicalResistance,
      magicalDefense: magicalDefense,
      magicalResistance: magicalResistance,
      criticalResistance: criticalResistance,
      avoidance: avoidance,
      dodge: dodge,
      block: block,
      difficultyOfTank: difficultyOfTank,
      difficultyOfMelee: difficultyOfMelee,
      difficultyOfRanged: difficultyOfRanged,
      possibilityOfRunningAround: possibilityOfRunningAround,
    });
  };
  
  return (
    <>
      <button
        onClick={handleUploadClick}
        className={
          "cloudUpload flex flex-none h-12 w-12 cursor-pointer items-center justify-center rounded-full hover:bg-bg-grey-20"
        }
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
        className={`formBoxBg fixed left-0 top-0 flex h-dvh w-dvw flex-col items-end justify-center bg-bg-dark-50 ${open}`}
      >
        <div
          onClick={handleUploadClick}
          className="formCloseBtn h-[9dvh] w-full cursor-pointer"
        ></div>
        <div className="formBoxContent flex h-[91dvh] w-full flex-col items-center bg-bg-white-100">
          <form
            id="createMonsterFrom"
            onSubmit={(e) => handleSubmit(e)}
            className={`flex min-h-full w-full lg:w-4/5 max-w-7xl flex-col gap-4 overflow-y-auto rounded p-5 ${bottom}`}
          >
            <div className="title flex w-full items-center justify-between">
              <div className="left flex gap-1">
                <Image
                  src={CloudUpload as StaticImport}
                  alt="Logo"
                  height={24}
                  width={24}
                  style={{ width: "24px", height: "auto" }}
                />
                <span className=" text-main-color-100">
                  {dictionary.ui.monster.upload}
                </span>
              </div>
              <div className="btnGroup flex gap-5">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="cloudUpload flex h-12 items-center justify-center rounded-full bg-bg-grey-8 px-6 text-main-color-100 hover:bg-bg-grey-20"
                >
                  {dictionary.ui.monster.cancel}
                </button>
              </div>
            </div>
            <div className="line h-line w-full bg-brand-color-blue"></div>
            <div className="inputArea h-full">
              <fieldset className="dataKinds flex flex-col lg:flex-row gap-4">
                <label>
                  {dictionary.db.monster.name}
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => nameHandleChange(e)}
                    className=" w-full mt-1 rounded-full bg-bg-grey-8 px-4 py-2 text-main-color-100"
                  />
                </label>
                <label>
                  {dictionary.db.monster.baseLv}
                  <input
                    type="number"
                    value={baseLv}
                    onChange={(e) => setBaseLv(e.target.valueAsNumber)}
                    className=" w-full mt-1 rounded-full bg-bg-grey-8 px-4 py-2 text-main-color-100"
                  />
                </label>
                <label>
                  {dictionary.db.monster.physicalDefense}
                  <input
                    type="number"
                    value={physicalDefense}
                    onChange={(e) => setPhysicalDefense(e.target.valueAsNumber)}
                    className=" w-full mt-1 rounded-full bg-bg-grey-8 px-4 py-2 text-main-color-100"
                  />
                </label>
                <label>
                  {dictionary.db.monster.physicalResistance}
                  <input
                    type="number"
                    value={physicalResistance}
                    onChange={(e) =>
                      setPhysicalResistance(e.target.valueAsNumber)
                    }
                    className=" w-full mt-1 rounded-full bg-bg-grey-8 px-4 py-2 text-main-color-100"
                  />
                </label>
                <label>
                  {dictionary.db.monster.magicalDefense}
                  <input
                    type="number"
                    value={magicalDefense}
                    onChange={(e) => setMagicalDefense(e.target.valueAsNumber)}
                    className=" w-full mt-1 rounded-full bg-bg-grey-8 px-4 py-2 text-main-color-100"
                  />
                </label>
                <label>
                  {dictionary.db.monster.magicalResistance}
                  <input
                    type="number"
                    value={magicalResistance}
                    onChange={(e) =>
                      setMagicalResistance(e.target.valueAsNumber)
                    }
                    className=" w-full mt-1 rounded-full bg-bg-grey-8 px-4 py-2 text-main-color-100"
                  />
                </label>
              </fieldset>
            </div>
            <div className="line h-line w-full bg-brand-color-blue"></div>
            <div className="functionArea flex w-full items-center justify-end">
              <div className="btnGroup flex gap-5">
                <button
                  type="submit"
                  className={`cloudUpload flex h-12 items-center justify-center rounded-full px-6 text-bg-white-100 ${submitBtnState ? " bg-main-color-100 hover:bg-bg-grey-20 hover:text-main-color-100" : " bg-main-color-50 cursor-no-drop"}`}
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
    </>
  );
}
