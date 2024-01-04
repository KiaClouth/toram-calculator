export interface IUserParams {
  userId: number;
  showExtraInfo: boolean;
}

export type TUserType = "user" | "admin" | "superAdmin";

export interface IUserResponse {
  id: number;
  name: string;
  age: number;
  roles: TUserType;
}
