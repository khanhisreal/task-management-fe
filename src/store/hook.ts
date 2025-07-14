import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { AppDispatch, RootState } from "./store";

//useDispatch hook - sending an action to the Redux
export const useAppDispatch: () => AppDispatch = useDispatch;
//useSelector hook - getting data from the state
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
