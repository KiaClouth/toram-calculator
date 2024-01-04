import {IAuthType, IResponse} from "@/request/type";
import {getAuthorization, getStringParams, handleResponse, hostMap} from "@/request/client/utils";

export const post = async <T>(
  url: string,
  data: any,
  authType: IAuthType = "default",
  revalidate = 20,
): Promise<IResponse<T>> => {
  const token = await getAuthorization(authType);
  const host = hostMap[authType];
  const finallyUrl = `${host}${url}`;
  const response = await fetch(finallyUrl, {
    headers: {
      Authorization: token,
    },
    method: "POST",
    body: data && JSON.stringify(data),
    next: {
      revalidate: revalidate,
    },
  });
  return await handleResponse(response);
};

export const get = async <T>(
  url: string,
  data: any = null,
  authType: IAuthType = "noToken",
  revalidate = 20,
): Promise<IResponse<T>> => {
  const token = await getAuthorization(authType);
  const host = hostMap[authType];
  const formatUrl = data ? `${url}?${getStringParams(data)}` : url;
  const finallyUrl = `${host}${formatUrl}`;
  const response = await fetch(finallyUrl, {
    headers: {
      Authorization: token,
    },
    method: "GET",
    next: {
      revalidate: revalidate,
    },
  });
  return await handleResponse(response);
};

export const remove = async <T>(
  url: string,
  data: any = null,
  authType: IAuthType = "default",
  revalidate = 20,
): Promise<IResponse<T>> => {
  const token = await getAuthorization(authType);
  const host = hostMap[authType];
  const formatUrl = data ? `${url}?${getStringParams(data)}` : url;
  const finallyUrl = `${host}${formatUrl}`;
  const response = await fetch(finallyUrl, {
    headers: {
      Authorization: token,
    },
    method: "DELETE",
    next: {
      revalidate: revalidate,
    },
  });
  return await handleResponse(response);
};

export const uploadFile = async <T>(url: string, file: File): Promise<IResponse<T>> => {
  const token = await getAuthorization("default");
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(url, {
    headers: {
      authorization: token,
    },
    method: "POST",
    body: formData,
  });
  return await handleResponse(response);
};

const clientHttp = {
  get,
  remove,
  post,
  uploadFile,
};
export default clientHttp;
