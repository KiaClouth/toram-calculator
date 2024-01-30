'use client'
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { api } from "~/trpc/react";
import { getDictionary } from "get-dictionary";

export default function CreateMonster(props: {
  dictionary: ReturnType<typeof getDictionary>;
}) {
  const { dictionary } = props;
  const router = useRouter();
  const [name, setName] = useState("");

  const createMonster = api.monster.create.useMutation({
    onSuccess: () => {
      console.log("成功了！");
    },
  });

  const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      createMonster.mutate({
        name: name,
        type: "COMMON_MOBS",
        state: "PRIVATE",
        element: null,
        baseLv: null,
        experience: null,
        address: null,
        radius: null,
        maxhp: null,
        physicalDefense: null,
        physicalResistance: null,
        magicalDefense: null,
        magicalResistance: null,
        criticalResistance: null,
        avoidance: null,
        dodge: null,
        block: null,
        difficultyOfTank: 0,
        difficultyOfMelee: 0,
        difficultyOfRanged: 0,
        possibilityOfRunningAround: 0,
      });
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className=" fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 shadow-md flex flex-col gap-2 bg-bg-grey-8"
    >
      <input
        type="text"
        placeholder="怪物名称"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className=" text-main-color-100 bg-bg-grey-8 w-full rounded-full px-4 py-2"
      />
      <button
        type="submit"
        className=" bg-main-color-100 hover:bg-main-color-70 active:bg-brand-color-orange rounded-full px-10 py-3"
        disabled={createMonster.isLoading}
      >
        {createMonster.isLoading ? "上传中..." : "上传"}
      </button>
    </form>
  );
}
