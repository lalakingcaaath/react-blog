import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout } from "./redux/userSlice";
import supabase from "./config/supabaseClient";
import { Outlet } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const handleSession = async (session: any) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          dispatch(
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              firstName: profile.firstName,
              lastName: profile.lastName,
            }),
          );
        }
      } else {
        dispatch(logout());
      }
      setAuthChecked(true);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return <Outlet />;
}

export default App;
