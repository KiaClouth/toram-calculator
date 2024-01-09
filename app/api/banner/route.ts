import serverHttp from "@/request/server";

export async function GET(request: Request) {
  request.headers.set("requestUrl", "/api/banner");
  const res = await serverHttp.get(request);
  // console.log('cao.....................')
  return res;
}
