export interface User {
  id: string;
  token: string;
}

export type UserPermission = string[]

export interface LoginDataType {
  idToken: string;
}