"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { api } from "~/trpc/react";

interface Film {
  name: string;
  baseLv: number;
}
// [{ name: "暂无数据", baseLv: 0 }]
export default function LongSearchBox() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly Film[]>([]);
  const loading = open && options.length === 0;
  const { data: monsterList, error } = api.monster.getList.useQuery();
  const topFilms = React.useMemo(() => {
    return monsterList === undefined
      ? [{ name: "暂无数据", baseLv: 0 }]
      : monsterList.map((monster) => {
          if (typeof monster.baseLv === "number") {
            return { name: monster.name, baseLv: monster.baseLv };
          } else {
            return { name: monster.name, baseLv: 0 };
          }
        });
  }, [monsterList]);

  React.useEffect(() => {
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
  }, [loading,topFilms]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Asynchronous"
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
  );
}
