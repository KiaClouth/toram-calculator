"use client";
import { Button, ThemeProvider, createTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";
import { themeOptions } from "~/app/themeOptions";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getDictionary } from "get-dictionary";

export default function CreateMonster(props: { dictionary: ReturnType<typeof getDictionary> }) {
  const { dictionary } = props;
  const router = useRouter();
  const [name, setName] = useState("");

  const createMonster = api.monster.create.useMutation({
    onSuccess: () => {
      console.log("成功了！");
    },
  });

  return (
    <ThemeProvider theme={createTheme(themeOptions)}>
      <Button variant="outlined" size="large" startIcon={<CloudUploadIcon />} disableElevation >
        {dictionary.ui.monster.upload}
      </Button>
      {/* <form
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
            possibilityOfRunningAround: 0,
          });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="怪物名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-black bg-black/10 w-full rounded-full px-4 py-2"
        />
        <button
          type="submit"
          className="bg-black/10 hover:bg-black/20 rounded-full px-10 py-3 font-semibold transition"
          disabled={createMonster.isLoading}
        >
          {createMonster.isLoading ? "上传中..." : "上传"}
        </button>
      </form> */}
    </ThemeProvider>
  );
}
