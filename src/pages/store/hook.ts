import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { RootState, AppDispatch } from "./store";

//useDispatch hook - sending an action to the Redux to
//dispatch means 'gửi' in Vietnamese
export const useAppDispatch: () => AppDispatch = useDispatch;
//useSelector hook - getting data from the state
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
