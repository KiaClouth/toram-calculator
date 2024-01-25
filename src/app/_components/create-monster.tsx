"use client";

import { type Monster } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export default function CreateMonster() {
  const router = useRouter();
  const [name, setName] = useState("");
  const monster: Monster = {
    name: name,
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedById: "",
    baseLv: null,
    experience: null,
    address: null,
    element: null,
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
    normalAttackResistanceModifier: null,
    physicalAttackResistanceModifier: null,
    magicalAttackResistanceModifier: null,
    difficultyOfTank: null,
    difficultyOfMelee: null,
    difficultyOfRanged: null,
    possibilityOfRunningAround: null,
    specialBehavior: null
  }

  
  const createMonster = api.monster.create.useMutation({
      onSuccess: () => {
          console.log("成功了！")
      },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // createMonster.mutate({monster});
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
        {createMonster.isLoading ? "保存中..." : "保存"}
      </button>
    </form>
  );
}
