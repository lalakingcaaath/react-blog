import { useNavigate } from "react-router";

export default function PreviousButton() {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost gap-2 pl-0 hover:bg-transparent self-start"
      >
        ← Back
      </button>
    </div>
  );
}
