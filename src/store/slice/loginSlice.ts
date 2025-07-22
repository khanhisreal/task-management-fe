import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  fullname: string;
  email: string;
  role: string;
  status: string;
  accountType: string;
  createdAt: string;
}

interface LoginState {
  user: User | null;
}

//the state that the reducer will affect
const initialState: LoginState = {
  user: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  //local reducer: defines possible actions for one specific slice of state
  //reducer func takes: state, action as args
  reducers: {
    //actions that we can do to affect the state
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

//export actions so that we can use them later in the components
export const { setUser, clearUser } = loginSlice.actions;
//export reducer to add to the root reducer
export default loginSlice.reducer;
