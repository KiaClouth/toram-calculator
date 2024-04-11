"use client";

import { type Post } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { tApi } from "~/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const defaultPost: Post = {
    id: 0,
    name: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: ""
  }

  const createPost = tApi.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setContent("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        console.log(content)
        e.preventDefault();
        createPost.mutate({
          ...defaultPost,
          name: content
        });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="rounded-full px-4 py-2 text-black"
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
