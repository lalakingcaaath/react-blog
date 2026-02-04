import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import type { RootState } from "../redux/store";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error: " + error);
    } else {
      dispatch(logout());
      navigate("/logout");
    }
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={() => navigate("/")}>
          Jecho's Blog
        </a>
      </div>
      <div className="flex gap-2">
        {user.id ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <span className="font-bold text-xs text-center block mb-2 opacity-50">
                  {user.firstName} {user.lastName}
                </span>
              </li>
              <li>
                <a onClick={() => navigate("/profile")}>Profile</a>
              </li>
              <li>
                <a onClick={handleSignOut}>Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
