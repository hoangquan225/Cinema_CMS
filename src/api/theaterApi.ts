import ENDPONTAPI from "../common/endpoint";
import { ApiConfig } from "./config";

export const apiGetTheaters = async (params: { limit?: number, skip?: number, provinceCode?: string, type?: number,  }) => {
  return ApiConfig(
    ENDPONTAPI.GET_THEATER,
    {
      params,
    },
    "GET"
  );
};

export const apiUpdateTheater = async (payload: any) => {
  return ApiConfig(ENDPONTAPI.UPDATE_THEATER, {
    payload,
  });
};

export const apiDeleteTheater = async (params: { id: string }) => {
  return ApiConfig(
    ENDPONTAPI.DELETE_THEATER,
    {
      params,
    }
  );
};

export const apiGetTheaterById = async (params: { id: string }) => {
  return ApiConfig(
    ENDPONTAPI.GET_THEATER_BY_ID,
    {
      params,
    }
  );
};

