import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";
import { Theater } from "../../models/theater";
import { apiDeleteTheater, apiGetTheaterById, apiGetTheaters, apiUpdateTheater } from "../../api/theaterApi";

interface TheaterState {
  theaters: Theater[],
  loading: boolean,
  error: string,
  theaterInfo: Theater | null,
  count: number,
}

const initialState: TheaterState = {
  theaters: [],
  loading: false,
  error: "",
  theaterInfo: null,
  count: 0,
};

export const requestLoadTheaters = createAsyncThunk('theater/loadTheaters', async (parms: {
  skip?: number;
  limit?: number;
  type?: number;
  provinceCode?: string;
}) => {
  const res = await apiGetTheaters(parms);
  return res.data
})

export const requestLoadTheaterById = createAsyncThunk('theater/loadTheaterByStatus', async (props: {
  id: string
}) => {
  const res = await apiGetTheaterById(props);
  return res.data
})

export const requestDeleteTheater = createAsyncThunk('theater/deleteTheater', async (id: string) => {
  const res = await apiDeleteTheater({id});
  return res.data
})


export const requestUpdateTheater = createAsyncThunk('theater/updateTheater', async (props: Theater) => {
  const res = await apiUpdateTheater(props);
  return res.data
})

export const theaterSlice = createSlice({
  name: "theater",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actionList = [requestLoadTheaters, requestLoadTheaterById, requestUpdateTheater];
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

    builder.addCase(requestLoadTheaters.fulfilled, (state, action: PayloadAction<{
      data: Theater[],
      status: number,
      count: number,
    }>) => {
      state.loading = false;
      state.theaters = action.payload.data.map((o) => new Theater(o));
      state.count = action.payload.count;
    })

    builder.addCase(requestLoadTheaterById.fulfilled, (state, action: PayloadAction<{
      data: Theater,
      status: number
    }>) => {
      state.loading = false;
      state.theaterInfo = new Theater(action.payload.data);
    })

    builder.addCase(requestUpdateTheater.fulfilled, (state, action: PayloadAction<{
      data: Theater,
      status: number
    }>) => {
      state.loading = false;
      state.theaterInfo = action.payload.data;
    })
  },
});

export const { } = theaterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const theaterState = (state: RootState) => state.theater;

export default theaterSlice.reducer;
