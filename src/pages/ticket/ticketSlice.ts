import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";
import { Ticket } from "../../models/ticket";
import { apiCreateTicket, apiGetAllTicket } from "../../api/ticketApi";

interface TicketState {
  tickets: Ticket[],
  loading: boolean,
  error: string,
  ticketInfo: Ticket | null,
  total: number
}

const initialState: TicketState = {
  tickets: [],
  loading: false,
  error: "",
  ticketInfo: null,
  total: 0
};
export const requestGetTicket = createAsyncThunk('film/getTicket', async (props: {
  filmId?: string, scheduleId?: string, limit?: number, skip?: number
}) => {
  const res = await apiGetAllTicket(props);
  return res.data
})

export const requestUpdateTicket = createAsyncThunk('film/updateTicket', async (props: any) => {
  const res = await apiCreateTicket(props);
  return res.data
})


export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actionList: any[] = [requestGetTicket, ];
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

    builder.addCase(requestGetTicket.fulfilled, (state, action: PayloadAction<{
      data: Ticket[],
      status: number,
      count: number
    }>) => {
      state.loading = false;
      state.tickets = action.payload.data.map((o) => new Ticket(o));
      state.total = action.payload.count;
    })

    // builder.addCase(requestUpdateSchedule.fulfilled, (state, action: PayloadAction<{
    //   data: Schedule,
    //   status: number
    // }>) => {
    //   state.loading = false;
    //   state.schedulesInfo = action.payload.data;
    // })

  },
});

export const { } = ticketSlice.actions;

export const ticketState = (state: RootState) => state.ticket;

export default ticketSlice.reducer;
