"use client";

import { type Session } from "next-auth"
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import React from "react";
import { type ClientSafeProvider, type LiteralUnion, signOut, signIn } from "next-auth/react";
import { type BuiltInProviderType } from "next-auth/providers/index";

const emails = ['username@gmail.com', 'user02@gmail.com'];

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null
    onClose: (value: string) => void;
}

export interface SignDialogProps {
    session: Session | null
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, selectedValue, open, providers } = props;
    const handleClose = () => {
        onClose(selectedValue);
    };
    const deviceName: string | undefined = navigator.userAgent;
  
  console.log("Device Name:", deviceName);

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>目前支持的登陆方式</DialogTitle>
            <List sx={{ pt: 0 }}>
                {Object.values(providers!).map((provider) => (
                    <ListItem disableGutters key={provider.name}>
                        <ListItemButton onClick={() => signIn(provider.id)}>
                            <Avatar>
                                <AddIcon />
                            </Avatar>
                            <ListItemText primary={provider.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}


export function SignDialog(props: SignDialogProps) {
    const { session, providers } = props;
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(emails[1]!);
    const handleClickSign = async () => {
        if (session === null) {
            setOpen(true);
        } else {
            await signOut({ redirect: false }).then(() => {
                // console.log('+++', getSession())
            })
        }
    };

    const handleClose = (value: string) => {
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickSign}>
                {session ? "登出" : "登录"}
            </Button>
            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                providers={providers}
            />
        </div>
    );
}