import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout } from "./redux/userSlice";
import supabase from "./config/supabaseClient";
import { Outlet } from "react-router-dom";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfileAndSetUser = async (
      userId: string,
      email: string | undefined,
    ) => {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profile && !error) {
        dispatch(
          setUser({
            id: userId,
            email: email || "",
            firstName: profile.firstName,
            lastName: profile.lastName,
          }),
        );
      }
    };

    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        fetchProfileAndSetUser(session.user.id, session.user.email);
      } else {
        dispatch(logout()); // Ensure state is clear if no session
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          fetchProfileAndSetUser(session.user.id, session.user.email);
        } else {
          dispatch(logout());
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  return <Outlet />;
}

export default App;
