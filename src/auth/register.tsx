import { useState } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

export default function Register() {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: data.user.id,
            firstName: firstName,
            lastName: lastName,
          },
        ]);

      if (profileError) {
        setMessage("User created, but profile failed: " + profileError.message);
      } else {
        dispatch(setUser(data.user));

        alert("Registration successful!");
        navigate("/");
      }
    }

    setfirstName("");
    setlastName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          {message && (
            <p className="mb-4 text-center text-red-500">{message}</p>
          )}
          <h1 className="text-5xl font-bold">Create your account now!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form className="fieldset" onSubmit={handleSubmit}>
              <label className="label">First Name</label>
              <input
                onChange={(e) => setfirstName(e.target.value)}
                value={firstName}
                type="text"
                className="input"
                placeholder="First Name"
                required
              />
              <label className="label">Last Name</label>
              <input
                onChange={(e) => setlastName(e.target.value)}
                value={lastName}
                type="text"
                className="input"
                placeholder="Last Name"
                required
              />
              <label className="label">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                className="input"
                placeholder="Email"
                required
              />
              <label className="label">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                className="input"
                placeholder="Password"
                required
              />
              <div>
                <a
                  className="link link-hover cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Already have an account?
                </a>
              </div>
              <button className="btn btn-neutral mt-4">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
