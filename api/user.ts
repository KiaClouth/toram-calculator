import {get} from "@/request/client";
import {IUserParams, IUserResponse} from "@/types/api/user";

export const getUserInfo = (params: IUserParams) => {
  return get<IUserResponse>("/api/v1/user/info", params, "default");
};
