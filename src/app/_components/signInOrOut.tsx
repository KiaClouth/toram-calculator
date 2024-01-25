"use client";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function SignInOrOut(props: { session: Session | null }) {
  const { session } = props;

  const btnContent = (s: Session | null) => {
    if (s === null) {
      return "登录";
    } else {
      if (s.user.image === undefined || s.user.image === null) {
        return "登出";
      } else {
        return (
          <Image src={s.user.image} alt={"用户头像"} width={40} height={40} />
        );
      }
    }
  };

  return (
    <SessionProvider session={session}>
      <Link
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className=" text-xs"
      >
        {btnContent(session)}
      </Link>
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
    </SessionProvider>
  );
}
