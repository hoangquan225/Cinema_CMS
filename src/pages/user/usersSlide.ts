import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";
import { UserInfo } from "../../models/user";
import { apiDeleteUser, apiGetAllUser, apiUpdateUser } from "../../api/userApi";

interface UserState {
  users: UserInfo[],
  loading: boolean,
  error: string,
  usersInfo: UserInfo | null,
  total: number
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: "",
  usersInfo: null,
  total: 0
};

export const requestGetAllUser = createAsyncThunk('user/getAllUser', async () => {
  const res = await apiGetAllUser();
  return res.data
})

export const requestUpdateUser = createAsyncThunk('user/updateUser', async (props: any) => {
  const res = await apiUpdateUser(props);
  return res.data
})

export const requestDeleteUser = createAsyncThunk('user/deleteUser', async (userId: any) => {
  const res = await apiDeleteUser({userId});
  return res.data
})

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actionList: any[] = [requestGetAllUser, requestUpdateUser, requestDeleteUser];
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

    builder.addCase(requestGetAllUser.fulfilled, (state, action: PayloadAction<{
      data: UserInfo[],
      status: number
    }>) => {
      state.loading = false;
      state.users = action.payload.data.map((o) => new UserInfo(o));
    })

    builder.addCase(requestUpdateUser.fulfilled, (state, action: PayloadAction<{
      data: UserInfo,
      status: number
    }>) => {
      state.loading = false;
      state.usersInfo = action.payload.data;
    })

    builder.addCase(requestDeleteUser.fulfilled, (state, action: PayloadAction<{
      data: UserInfo,
      status: number
    }>) => {
      state.loading = false;
    })
  },
});

export const { } = userSlice.actions;

export const userState = (state: RootState) => state.user;

export default userSlice.reducer;
