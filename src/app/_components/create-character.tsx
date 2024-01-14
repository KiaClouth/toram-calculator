"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreateCharacter() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [baseAbiStr, setbaseAbiStr] = useState(1);

  const createPost = api.post.createCharacter.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({name,baseAbiStr});
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="机体名称"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="number"
        placeholder="基础力量"
        value={baseAbiStr}
        onChange={(e) => setbaseAbiStr(Number(e.target.value))}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
