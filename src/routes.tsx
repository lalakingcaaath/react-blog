import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Login from "./auth/login";
import Register from "./auth/register";
import Logout from "./pages/logout";
import CreatePost from "./pages/createpost";
import ViewPost from "./pages/viewBlog";
import EditPost from "./pages/editpost";
import EditProfile from "./pages/editProfile";
import ProtectedRoute from "./auth/protectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "logout", element: <Logout /> },
      {
        path: "createpost",
        element: (
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        ),
      },
      {
        path: "viewpost/:id",
        element: (
          <ProtectedRoute>
            <ViewPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "editpost/:id",
        element: (
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "editprofile",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
