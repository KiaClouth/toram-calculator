'use client'
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

export default function SignInOrOut(props: {
  session: Session | null
}) {
  const { session } = props
  return (
    <SessionProvider session={session}>
      <Link
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className=" text-xs"
      >
        {session ? "登出" : "登录"}
      </Link>
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
    </SessionProvider>
  );
}
