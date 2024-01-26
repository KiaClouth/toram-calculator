import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { type Monster } from '@prisma/client';

export default function MonsterDialog(props: { monsterData: Monster | undefined, monsterDialogState: boolean, setMonsterDialogState: (state:boolean) => void }) {
  const { monsterData,monsterDialogState, setMonsterDialogState } = props;

  const descriptionElementRef = React.useRef<HTMLElement>(null);

  function handleCancel(): void {
    setMonsterDialogState(false)
  }

  function handleModify(): void {
    setMonsterDialogState(false)
  }

  return (
    <React.Fragment>
      <Dialog
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
          <Button onClick={handleCancel}>关闭</Button>
          <Button onClick={handleModify}>修改</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
