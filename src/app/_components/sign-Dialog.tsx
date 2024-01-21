"use client";

import { type Session } from "next-auth";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
1// import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import React, { useState } from "react";
import {
    type ClientSafeProvider,
    type LiteralUnion,
    signOut,
    signIn,
    getSession,
    SessionProvider,
} from "next-auth/react";
import { type BuiltInProviderType } from "next-auth/providers/index";
import { Collapse, Divider, ListItemAvatar, ListItemIcon, TextField } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Email, ExpandLess, ExpandMore } from "@mui/icons-material";

export interface SignDialogProps {
    session: Session | null;
    providers: Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    > | null;
    host: string
}

export function SignDialog(props: SignDialogProps) {
    // const { data: session } = useSession()
    const { session, providers, host } = props;
    const [dailogState, setDailogState] = useState(false);
    const [emailInputState, setEmailInputState] = useState(false);
    const [email, setEmail] = useState("")
    const handleClickSign = async () => {
        if (session === null) {
            setDailogState(true);
        } else {
            await signOut({ redirect: false }).then(() => {
                console.log("+++", getSession());
            });
        }
    };

    return (
        <SessionProvider session={session}>
            <Button variant="outlined" onClick={handleClickSign}>
                {session ? "登出" : "登录"}
            </Button>

            <Dialog onClose={() => { setDailogState(!dailogState) }} open={dailogState}>
                <DialogTitle sx={{ paddingLeft: 8, paddingRight: 8 }}>目前支持的登陆方式</DialogTitle>
                <Divider />
                <List component="nav">
                    {Object.values(providers!).map((provider) =>
                        provider.name !== "Email" ? (
                            <ListItemButton key={provider.name} onClick={() => signIn(provider.id)}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={provider.name} />
                            </ListItemButton>
                        ) : (
                            <ListItemButton key={provider.name} onClick={() => { setEmailInputState(!emailInputState) }}>
                                <ListItemIcon>
                                    <Email />
                                </ListItemIcon>
                                <ListItemText primary="使用邮箱登录" />
                                {emailInputState ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        ),
                    )}
                    <Collapse in={emailInputState} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <TextField
                                id="email-input"
                                label="邮箱地址"
                                variant="outlined"
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setEmail(event.target.value);
                                }}
                            />
                            <ListItemButton onClick={() => signIn('Email', {
                                email: email,
                                callbackUrl: host
                            })}>
                                <ListItemText primary={'发送验证邮件'} />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
            </Dialog>
        </SessionProvider>
    );
}
