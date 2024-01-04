import serverHttp from "@/request/server";

export async function GET(request: Request) {
  request.headers.set("requestUrl", "/api/v1/banner/list");
  const res = await serverHttp.get(request);
  return res;
}
