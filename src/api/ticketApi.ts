import ENDPONTAPI from "../common/endpoint";
import { ApiConfig } from "./config";

export const apiGetAllTicket = async (params: { filmId?: string, scheduleId?:string, limit?: number, skip?: number }) => {
  return ApiConfig(
    ENDPONTAPI.GET_ALL_TICKET,
    {
      params,
    }
  );
};

export const apiDeleteTicket = async (params: { ticketId: string }) => {
  return ApiConfig(
    ENDPONTAPI.DELETE_TICKET,
    {
      params,
    }
  );
};

export const apiCreateTicket = async (payload: any) => {
  return ApiConfig(ENDPONTAPI.CREATE_TICKET, {
    payload,
  });
};