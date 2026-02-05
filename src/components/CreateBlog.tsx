import { useNavigate } from "react-router";

export default function CreateBlog() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="btn btn-primary mt-6"
      onClick={() => navigate("/createpost")}
    >
      Create a Blog
    </button>
  );
}
