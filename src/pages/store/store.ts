import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slice/loginSlice";
import userReducer from "./slice/userSlice";
import projectReducer from "./slice/projectSlice";
import taskReducer from "./slice/taskSlice";

export const store = configureStore({
  //root reducer of the entire Redux store
  reducer: {
    login: loginReducer,
    user: userReducer,
    project: projectReducer,
    task: taskReducer,
  },
});

//export the entire shape of the Redux state
export type RootState = ReturnType<typeof store.getState>;

//export the type of the store.dispatch function
export type AppDispatch = typeof store.dispatch;
