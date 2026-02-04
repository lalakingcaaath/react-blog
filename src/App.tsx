import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/userSlice";
import supabase from "./config/supabaseClient";
import { Outlet } from "react-router-dom";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      dispatch(setUser(session?.user || null));
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch(setUser(session?.user || null));
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  return <Outlet />;
}

export default App;
