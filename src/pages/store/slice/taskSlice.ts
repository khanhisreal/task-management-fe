/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import taskClient from "../../../clients/taskService";

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  projectIds: string[];
  projectTitles: string[];
  createdAt: string;
};

type TaskState = {
  tasks: Task[];
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: TaskState = {
  tasks: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (
    params: { page: number; limit: number; query: string; status: string },
    thunkAPI
  ) => {
    try {
      const { page, limit, query, status } = params;
      const skip = (page - 1) * limit;

      const queryParams = new URLSearchParams();
      if (query) queryParams.append("query", query);
      if (status) queryParams.append("status", status);
      queryParams.append("skip", skip.toString());
      queryParams.append("limit", limit.toString());

      const response = await taskClient.get(`/task?${queryParams.toString()}`);

      return {
        tasks: response.data.tasks,
        total: response.data.total,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch tasks."
      );
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.total = action.payload.total;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as { message?: string } | null)?.message ||
          "Failed to fetch tasks.";
      });
  },
});

export default taskSlice.reducer;
