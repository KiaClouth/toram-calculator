"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreateCharacter() {
  const router = useRouter();
  const [name, setName] = useState("");

  const createPost = api.character.createCharacter.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({name});
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="机体名称"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className=" rounded-full px-4 py-2 text-primary-color bg-transition-color-8"
      />
      <button
        type="submit"
        className="rounded-full bg-transition-color-8 px-10 py-3 font-semibold transition hover:bg-transition-color-20"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "保存中..." : "保存"}
      </button>
    </form>
  );
}
