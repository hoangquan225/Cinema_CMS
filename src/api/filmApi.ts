import ENDPONTAPI from "../common/endpoint";
import { Film } from "../models/film";
import { ApiConfig } from "./config";

export const apiGetAllFilm = async (payload?: {
  skip?: number;
  limit?: number;
}) => {
  return ApiConfig(
    ENDPONTAPI.GET_ALL_FILM,
    {
      params: {
        skip: payload?.skip,
        limit: payload?.limit,
      },
    },
    "GET"
  );
};

export const apiUpdateFilm = async (payload: Film) => {
  return ApiConfig(ENDPONTAPI.UPDATE_FILM, {
    payload,
  });
};

export const apiGetFilmById = async (params: { id: string }) => {
  return ApiConfig(
    ENDPONTAPI.GET_FILM_BY_ID,
    {
      params,
    }
  );
};

export const apiGetFilmByStatus = async (params: { status: number }) => {
  return ApiConfig(
    ENDPONTAPI.GET_FILM_BY_STATUS,
    {
      params
    }
  );
};

export const apiSearchFilm = async (params: { name: string }) => {
  return ApiConfig(
    ENDPONTAPI.SEARCH_FILM,
    {
      params,
    },
    "GET"
  );
};
