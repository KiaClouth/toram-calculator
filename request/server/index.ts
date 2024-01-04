import {NextResponse} from "next/server";
import {formatBody} from "@/request/server/utils";
import {IAuthType} from "@/request/type";
const host = process.env.NEXT_PUBLIC_HOST;
const get = async (request: Request) => {
  try {
    const {search} = new URL(request.url);
    const token = request.headers.get("Authorization") as string;
    const contentType = request.headers.get("Content-Type") as string;
    const requestUrl = request.headers.get("requestUrl") as string;
    const authType = request.headers.get("authType") as IAuthType;
    const res = await fetch(`${host}${requestUrl}${search}`, {
      headers: {
        "Content-Type": contentType,
        Authorization: token,
      },
      method: "GET",
      // cache: "force-cache",
    });
    // return NextResponse.json(res);
    return res;
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.error();
  }
};

const post = async (request: Request) => {
  try {
    const {search} = new URL(request.url);
    const token = request.headers.get("Authorization") as string;
    const contentType = request.headers.get("Content-Type") as string;
    const requestUrl = request.headers.get("requestUrl") as string;
    const authType = request.headers.get("authType") as IAuthType;
    const data = await formatBody(request.body, contentType);
    const res = await fetch(`${host}${requestUrl}${search}`, {
      headers: {
        "Content-Type": contentType,
        Authorization: token,
      },
      method: "POST",
      body: data,
      // cache: "force-cache",
    });
    return res;
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.error();
  }
};

const serverHttp = {
  get,
  post,
};

export default serverHttp;
