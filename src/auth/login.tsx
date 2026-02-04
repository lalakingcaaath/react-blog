import { useNavigate } from "react-router";
import { useState } from "react";
import supabase from "../config/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage("Error: " + error.message);
      setEmail("");
      setPassword("");
      return;
    }

    if (data) {
      navigate("/");
      return null;
    }
  };

  const navigate = useNavigate();

  return (
    <div className="hero bg-base-200 min-h-screen">
      {message && <p className="mb-4 text-center">{message}</p>}
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form className="fieldset" onSubmit={handleSubmit}>
              <label className="label">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="input"
                placeholder="Email"
                required
              />
              <label className="label">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="input"
                placeholder="Password"
                required
              />
              <div>
                <a
                  className="link link-hover"
                  onClick={() => navigate("/register")}
                >
                  Don't have an account yet?
                </a>
              </div>
              <button type="submit" className="btn btn-neutral mt-4">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
