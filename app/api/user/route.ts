import serverHttp from "@/request/server";

export async function POST(request: Request) {
  // console.log(request)
  const res = await serverHttp.post(request);
  return res;
}
