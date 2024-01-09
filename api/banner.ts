import {post} from "@/request/client";
import {IUserParams, IUserResponse} from "@/types/api/user";

export const getUserInfo = (params: IUserParams) => {
  console.log("草。。。。。api/user");
  return post<IUserResponse>("/api/v1/user/info", params, "default");
};
