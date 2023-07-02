import { ApiConfig } from "./config";
import EndPoint from "../common/endpoint";

export const apiGetUserFromToken = (token: string) => {
  return ApiConfig(EndPoint.GET_USER_FROM_TOKEN, {
    payload: {
      token,
    },
  });
};

export const apiLogin = (payload: { email: string; password: string, userRole: number }) => {
  return ApiConfig(EndPoint.LOGIN, { payload });
};
