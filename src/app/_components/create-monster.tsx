"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export default function CreateMonster() {
  const router = useRouter();
  const [name, setName] = useState("");

  
  const createMonster = api.monster.create.useMutation({
      onSuccess: () => {
          console.log("成功了！")
      },
  });

  return (
    <form
      onSubmit={(e) => {
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
          possibilityOfRunningAround: 0
        });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="怪物名称"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black bg-black/10"
      />
      <button
        type="submit"
        className="rounded-full bg-black/10 px-10 py-3 font-semibold transition hover:bg-black/20"
        disabled={createMonster.isLoading}
      >
        {createMonster.isLoading ? "上传中..." : "上传"}
      </button>
    </form>
  );
}
