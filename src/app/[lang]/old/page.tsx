import { CreateCharacter } from "~/app/[lang]/_components/create-character";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Kiya <span className="text-[hsl(280,100%,70%)]">の</span> Toram-Calculactor
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-black">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-black">
              {session && <span>哦哈喵~{session.user?.name}</span>}
            </p>
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

  const latestPost = await api.post.getLatest.query();

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
