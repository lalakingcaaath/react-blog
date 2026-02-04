import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Login from "./auth/login";
import Register from "./auth/register";
import Logout from "./pages/logout";
import CreatePost from "./pages/createpost";
import ViewPost from "./pages/viewBlog";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "logout", element: <Logout /> },
      { path: "createpost", element: <CreatePost /> },
      { path: "viewpost/:id", element: <ViewPost /> },
    ],
  },
]);
