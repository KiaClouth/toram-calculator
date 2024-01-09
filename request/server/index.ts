import {NextResponse} from "next/server";
import {formatBody} from "@/request/server/utils";
import {IAuthType} from "@/request/type";
const host = process.env.NEXT_PUBLIC_HOST;
const get = async (request: Request) => {
  try {
    const {search} = new URL(request.url);
    // console.log("search:" + search);
    const token = request.headers.get("Authorization") as string;
    // console.log("token:" + token);
    const contentType = request.headers.get("Content-Type") as string;
    // console.log("content-Type:" + contentType);
    const requestUrl = request.headers.get("requestUrl") as string;
    // console.log("requestUrl:" + requestUrl);
    const authType = request.headers.get("authType") as IAuthType;
    console.log("authType:" + authType);
    console.log(`${host}${requestUrl}${search}`);
    const res = await fetch(`${host}${requestUrl}${search}`, {
      headers: {
        "Content-Type": contentType,
        Authorization: token,
      },
      method: "GET",
      // cache: "force-cache",
    });
    // return NextResponse.json(res);
    // console.log("res:", res);
    console.log("GET——allow:", res.headers.get("allow"));
    return res;
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.error();
  }
};

const post = async (request: Request) => {
  try {
    const {search} = new URL(request.url);
    // console.log('search:' + search)
    const token = request.headers.get("Authorization") as string;
    // console.log('token:' + token)
    const contentType = request.headers.get("Content-Type") as string;
    // console.log('content-Type:' + contentType)
    const requestUrl = request.headers.get("requestUrl") as string;
    // console.log('requestUrl:' + requestUrl)
    const authType = request.headers.get("authType") as IAuthType;
    // console.log('authType:' + authType)
    const data = await formatBody(request.body, contentType);
    // console.log('data:' + data)
    const res = await fetch(`${host}${requestUrl}${search}`, {
      headers: {
        "Content-Type": contentType,
        Authorization: token,
      },
      method: "POST",
      body: data,
      // cache: "force-cache",
    });
    // console.log("res:", res);
    console.log("POST——allow:", res.headers.get("allow"));
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
