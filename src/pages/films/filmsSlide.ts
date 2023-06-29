import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";
import { Film } from "../../models/film";
import { apiGetAllFilm, apiGetFilmByStatus } from "../../api/filmApi";

interface FilmState {
  films: Film[],
  loading: boolean,
  error: string,
  categoryInfo: Film | null
}

const initialState: FilmState = {
  films: [],
  loading: false,
  error: "",
  categoryInfo: null,
};

export const requestLoadFilms = createAsyncThunk('film/loadFilms', async (props: {
  skip?: number;
  limit?: number;
}) => {
  const res = await apiGetAllFilm(props);
  return res.data
})


export const requestLoadFilmsByStatus = createAsyncThunk('film/loadFilmsByStatus', async (props: {
  status: number
}) => {
  const res = await apiGetFilmByStatus(props);
  return res.data
})


export const filmSlice = createSlice({
  name: "film",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actionList = [requestLoadFilms, requestLoadFilmsByStatus];
    actionList.forEach(action => {
      builder.addCase(action.pending, (state) => {
        state.loading = true;
      })
    })
    actionList.forEach(action => {
      builder.addCase(action.rejected, (state) => {
        state.loading = false;
      })
    })

    builder.addCase(requestLoadFilms.fulfilled, (state, action: PayloadAction<{
      data: Film[],
      status: number
    }>) => {
      state.loading = false;
      state.films = action.payload.data.map((o) => new Film(o));
    })

    builder.addCase(requestLoadFilmsByStatus.fulfilled, (state, action: PayloadAction<{
      data: Film[],
      status: number
    }>) => {
      state.loading = false;
      state.films = action.payload.data.map((o) => new Film(o));
    })
  },
});

export const { } = filmSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const filmState = (state: RootState) => state.film;

export default filmSlice.reducer;
