"use client";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeOptions } from "~/app/themeOptions";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { type Monster } from "@prisma/client";
import MonsterDialog from "./monsterDisplay";
import { type getDictionary } from "get-dictionary";
import tailwindConfig from "tailwind.config";

const tailwindColor = tailwindConfig.theme.colors

interface Film {
  name: string;
  baseLv: number;
  id: string
}

export default function LongSearchBox(props: {dictionary: ReturnType<typeof getDictionary> ,monsterList:Monster[]}) {
  const { dictionary, monsterList } = props;
  const [monsterData, setMonsteData] = React.useState(monsterList[0]);
  const [monsterDialogState, setMonsterDialogState] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly Film[]>([]);
  const loading = options.length === 0;
  const handleChange = (event: React.SyntheticEvent<Element, Event>, shortMonsertData: Film) => {
    for (const monsterData of monsterList) {
      if (monsterData.id === shortMonsertData.id) {
        setMonsteData(monsterData)
        setMonsterDialogState(true)
      }
    }
  };

  React.useEffect(() => {
    const topFilms = monsterList === undefined
    ? [{ name: "", baseLv: 0, id: "" }]
    : monsterList.map((monster) => {
        if (typeof monster.baseLv === "number") {
          return { name: monster.name, baseLv: monster.baseLv, id: monster.id };
        } else {
          return { name: monster.name, baseLv: 0, id: monster.id };
        }
      });
    let active = true;

    if (!loading) {
      return undefined;
    }

    if (active) {
      setOptions([...topFilms]);
    }

    return () => {
      active = false;
    };
  }, [loading, monsterList]);

  // React.useEffect(() => {
  //   if (!open) {
  //     setOptions([]);
  //   }
  // }, [open]);

  return (
    <ThemeProvider theme={createTheme(themeOptions)}>
      <Autocomplete
        id="asynchronous-demo"
        sx={{ flex: "1 1 0%", '.MuiInputBase-root': { borderRadius: 9999, px:2, bgcolor:tailwindColor["bg-grey"][8] }, '& .MuiFormLabel-root': { pl:2 },'& .MuiFormLabel-root.Mui-focused': { pl:0 } }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(e, value) => handleChange(e,value ? value : {name:"",baseLv: 0, id:""})}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={dictionary.ui.monster.searchPlaceholder}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      <MonsterDialog dictionary={dictionary} monsterData={monsterData} monsterDialogState={monsterDialogState} setMonsterDialogState={setMonsterDialogState} />
    </ThemeProvider>
  );
}
