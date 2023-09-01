import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";
import { Schedule } from "../../models/schedule";

interface ScheduleState {
  schedules: Schedule[],
  loading: boolean,
  error: string,
  schedulesInfo: Schedule | null
}

const initialState: ScheduleState = {
  schedules: [],
  loading: false,
  error: "",
  schedulesInfo: null,
};


export const scheduleSlice = createSlice({
  name: "scedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actionList: any[] = [];
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

    
  },
});

export const { } = scheduleSlice.actions;

export const scheduleState = (state: RootState) => state.schedule;

export default scheduleSlice.reducer;
