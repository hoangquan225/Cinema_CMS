import ENDPONTAPI from "../common/endpoint";
import { Schedule } from "../models/schedule";
import { ApiConfig } from "./config";

export const apiGetSchedule = async (params: { filmId?: string, limit?: number, skip?: number }) => {
  return ApiConfig(
    ENDPONTAPI.GET_SCHEDULE,
    {
      params,
    }
  );
};

export const apiUpdateSchedule = async (payload: any) => {
  return ApiConfig(ENDPONTAPI.UPDATE_SCHEDULE, {
    payload,
  });
};