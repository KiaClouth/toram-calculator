"use client";
import React from "react";
import { type getDictionary } from "~/app/get-dictionary";
import { type Session } from "next-auth";
import CreateMonster from "./create-monster";
import { defaultMonster } from "~/app/store";

export default function PetPageClient(props: {
  dictionary: ReturnType<typeof getDictionary>;
  session: Session | null;
}) { 
  const { dictionary, session } = props;

  return (
    <div>
      <React.Fragment>
        <CreateMonster
          dictionary={dictionary}
          session={session}
          defaultMonster={defaultMonster}
        />
      </React.Fragment>
    </div>
  );
}
