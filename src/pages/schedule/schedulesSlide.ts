import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";
import { Schedule } from "../../models/schedule";
import { apiDeleteSchedule, apiGetSchedule, apiUpdateSchedule } from "../../api/sheduleApi";

interface ScheduleState {
  schedules: Schedule[],
  loading: boolean,
  error: string,
  schedulesInfo: Schedule | null,
  total: number
}

const initialState: ScheduleState = {
  schedules: [],
  loading: false,
  error: "",
  schedulesInfo: null,
  total: 0
};

export const requestGetSchedule = createAsyncThunk('film/getSchedule', async (props: {
  filmId?: string, limit?: number, skip?: number, isAll?: boolean, theater?: number
}) => {
  const res = await apiGetSchedule(props);
  return res.data
})

export const requestUpdateSchedule = createAsyncThunk('film/updateSchedule', async (props: any) => {
  const res = await apiUpdateSchedule(props);
  return res.data
})

export const requestDeleteSchedule = createAsyncThunk('ticket/deleteTicket', async (scheduleId: any) => {
  const res = await apiDeleteSchedule({scheduleId});
  return res.data
})

export const scheduleSlice = createSlice({
  name: "scedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actionList: any[] = [requestGetSchedule, requestUpdateSchedule, requestDeleteSchedule];
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

    builder.addCase(requestGetSchedule.fulfilled, (state, action: PayloadAction<{
      data: Schedule[],
      status: number,
      count: number
    }>) => {
      state.loading = false;
      state.schedules = action.payload.data.map((o) => new Schedule(o));
      state.total = action.payload.count;
    })

    builder.addCase(requestUpdateSchedule.fulfilled, (state, action: PayloadAction<{
      data: Schedule,
      status: number
    }>) => {
      state.loading = false;
      state.schedulesInfo = action.payload.data;
    })

    builder.addCase(requestDeleteSchedule.fulfilled, (state, action: PayloadAction<{
      data: Schedule,
      status: number
    }>) => {
      state.loading = false;
    })
  },
});

export const { } = scheduleSlice.actions;

export const scheduleState = (state: RootState) => state.schedule;

export default scheduleSlice.reducer;
