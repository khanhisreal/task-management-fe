import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
  },
});

export const { setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
