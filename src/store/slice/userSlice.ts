/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userApi } from "../../api";

export interface User {
  _id: string;
  fullname: string;
  email: string;
  role: string;
  status: string;
  accountType: string;
  createdAt: string;
  updatedAt: string;
  iat: number;
  exp: number;
}

interface UserState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (
    {
      page,
      limit,
      query,
      role,
      status,
    }: {
      page: number;
      limit: number;
      query: string;
      role: string;
      status: string;
    },
    thunkAPI
  ) => {
    try {
      const skip = (page - 1) * limit;
      const params = new URLSearchParams();
      params.append("skip", skip.toString());
      params.append("limit", limit.toString());
      if (query) params.append("query", query);
      if (role) params.append("role", role);
      if (status) params.append("status", status);

      const response = await userApi.get(`/user?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
