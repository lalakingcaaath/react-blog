import { useNavigate } from "react-router";

export default function Logout() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-7 my-10">
      <h1 className="text-4xl underline text-center">
        You have been logged out.
      </h1>
      <a
        className="btn bg-blue-500 text-white max-w-4xl mx-auto"
        onClick={() => navigate("/login")}
      >
        Return to Login
      </a>
    </div>
  );
}
