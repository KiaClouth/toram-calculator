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

interface Film {
  name: string;
  baseLv: number;
  id: string
}

export default function LongSearchBox(props: {monsterList:Monster[]}) {
  const { monsterList } = props;
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
    ? [{ name: "暂无数据", baseLv: 0, id: "" }]
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
        className="flex-1"
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(e, value) => handleChange(e,value ? value : {name:"默认",baseLv: 0, id:"默认"})}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="传说中的怪物名字"
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
      <MonsterDialog monsterData={monsterData} monsterDialogState={monsterDialogState} setMonsterDialogState={setMonsterDialogState} />
    </ThemeProvider>
  );
}
