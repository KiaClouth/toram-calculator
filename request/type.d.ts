export type IAuthType = "noToken" | "default" | "ai";

export interface IOptions {
  headers?: {[key: string]: string};
  body?: any;
  authType?: IAuthType;
  requestUrl: string;
}

export interface IResponse<T> {
  code: number;
  data: T;
  message: string;
}

export type IQueryParams = {
  [key: string]: any;
};
