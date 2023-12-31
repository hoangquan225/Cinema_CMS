import ENDPONTAPI from "../common/endpoint";
import { ApiConfig } from "./config";

export const apiGetSchedule = async (params: { filmId?: string, limit?: number, skip?: number, isAll?: boolean, theater?: number }) => {
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

export const apiDeleteSchedule = async (params: { scheduleId: string }) => {
  return ApiConfig(
    ENDPONTAPI.DELETE_SCHEDULE,
    {
      params,
    }
  );
};
