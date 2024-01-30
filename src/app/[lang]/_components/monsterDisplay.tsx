'use client'
import * as React from 'react';
import { type Monster } from '@prisma/client';
import { type getDictionary } from "get-dictionary";

export default function MonsterDialog(props: {dictionary: ReturnType<typeof getDictionary>, monsterData: Monster | undefined, monsterDialogState: boolean, setMonsterDialogState: (state:boolean) => void }) {
  const { dictionary,monsterData,monsterDialogState, setMonsterDialogState } = props;

  const descriptionElementRef = React.useRef<HTMLElement>(null);

  function handleCancel(): void {
    setMonsterDialogState(false)
  }

  function handleModify(): void {
    setMonsterDialogState(false)
  }

  return (
    <React.Fragment>
      {/* <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        open={monsterDialogState}
        onClose={handleCancel}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{JSON.stringify(monsterData?.name, null, 2) + "的属性"}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            sx={{wordBreak: "break-all"}}
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {JSON.stringify(monsterData)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{dictionary.ui.monster.save}</Button>
          <Button onClick={handleModify}>{dictionary.ui.monster.modify}</Button>
        </DialogActions>
      </Dialog> */}
    </React.Fragment>
  );
}
