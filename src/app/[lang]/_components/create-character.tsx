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
        className="w-full rounded-full px-4 py-2 text-black bg-black/10"
      />
      <button
        type="submit"
        className="rounded-full bg-black/10 px-10 py-3 font-semibold transition hover:bg-black/20"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "保存中..." : "保存"}
      </button>
    </form>
  );
}
