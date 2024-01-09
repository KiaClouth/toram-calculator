import serverHttp from "@/request/server";

export async function GET(request: Request) {
  console.log("cao.....................");
  request.headers.set("requestUrl", "/api/banner");
  const res = await serverHttp.get(request);
  return res;
}
