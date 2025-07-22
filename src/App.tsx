import { RouterProvider } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/hook";
import { useEffect } from "react";
import { router } from "./RouteConfig";
import { clearUser, setUser } from "./store/slice/loginSlice";
import { setAuthChecked } from "./store/slice/authSlice";
import Backdrop from "./pages/authentication/Backdrop";
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useAppDispatch();
  const isAuthChecked = useAppSelector((state) => state.auth.isAuthChecked);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        dispatch(setUser(payload));
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(clearUser());
      }
    }
    dispatch(setAuthChecked(true));
  }, [dispatch]);

  if (!isAuthChecked) {
    return <Backdrop />;
  }

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop
        limit={3}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;
