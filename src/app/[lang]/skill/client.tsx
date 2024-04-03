"use client";

import { type Skill } from "@prisma/client";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";
import React from "react";

export default function SkillPageClient(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
  skillList: Skill[];
}) {
  const { dictionary, session } = props;

  return (
    <main className="flex h-[calc(100dvh-67px)] flex-col lg:h-dvh lg:w-[calc(100dvw-96px)] lg:flex-row">
    </main>
  );
}
