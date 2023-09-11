import ENDPONTAPI from "../common/endpoint";
import { ApiConfig } from "./config";

export const apiGetSchedule = async (params: { filmId?: string, limit?: number, skip?: number  }) => {
    return ApiConfig(
      ENDPONTAPI.GET_SCHEDULE,
      {
        params,
      }
    );
  };