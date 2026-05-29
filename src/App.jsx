import { Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import Login from "./pages/loginpage";
import Home from "./pages/homepage";
import Signup from "./pages/signuppage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./store/authSlice";
import Openeditor from "./pages/editorpage";
import Adminpage from "./pages/adminpage";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, authChecked, user } = useSelector((state) => state.auth);

  useEffect(() => {
      dispatch(checkAuth());
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>
            <span className="loading loading-dots loading-xl"></span>
        </p>
      </div>
    );
  }


  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/signup" />}
        />
        <Route
          path="/problems/:id"
          element={isAuthenticated ? <Openeditor /> : <Navigate to="/signup" />}
        />
        <Route
          path="/admin"
          element={isAuthenticated && user?.role === 'admin' ? <Adminpage /> : <><p className="flex h-screen items-center justify-center">Unauthorized acess</p></>}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
    </>
  );
}

export default App;
