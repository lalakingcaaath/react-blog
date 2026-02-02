import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Login from "./auth/login";
import Register from "./auth/register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home />  },
      { path: "profile", element: <Profile /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> }
    ],
  },
]);
