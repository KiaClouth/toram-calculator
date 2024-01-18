import Link from "next/link";

import { env } from "~/env";
// import { CreatePost } from "~/app/_components/create-post";
import { CreateCharacter } from "~/app/_components/create-character";
import { SignDialog } from "~/app/_components/sign-Dialog"
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { getProviders } from "next-auth/react";
export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();
  const providers = await getProviders();
  const host = env.NEXTAUTH_URL
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Kiya <span className="text-[hsl(280,100%,70%)]">の</span> Toram-Calculactor
        </h1>
        {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-black/10 p-4 hover:bg-black/20"
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-black/10 p-4 hover:bg-black/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div> */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-black">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-black">
              {session && <span>哦哈喵~{session.user?.name}</span>}
            </p>
            <SignDialog session={session} providers={providers} host={host} />
            {/* <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-black/10 px-10 py-3 font-semibold no-underline transition hover:bg-black/20"
            >
              {session ? "登出" : "登录"}
            </Link> */}
          </div>
        </div>
        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.get.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">上一次发送的post内容: {latestPost.name}</p>
      ) : (
        <p>你还没有发送过任何post.</p>
      )}
      <CreateCharacter />
    </div>
  );
}
