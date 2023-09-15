import ENDPONTAPI from "../common/endpoint";
import { ApiConfig } from "./config";

export const apiGetAllUser = async () => {
  return ApiConfig(
    ENDPONTAPI.GET_ALL_USER
  );
};

export const apiUpdateUser = async (payload: any) => {
  return ApiConfig(ENDPONTAPI.UPDATE_STATUS_USER, {
    payload,
  });
};


export const apiDeleteUser = async (payload: any) => {
  return ApiConfig(ENDPONTAPI.UPDATE_USER, {
    payload,
  });
};
