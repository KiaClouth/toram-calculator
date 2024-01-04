import serverHttp from "@/request/server";

export async function POST(request: Request) {
  const res = await serverHttp.post(request);
  return res;
}
