import Navbar from "../components/Navbar";
import Avatar from "../components/Avatar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-row container mx-auto justify-center p-4 space-y-4 max-w-5xl grow">
        <div className="flex flex-col gap-4">
          <Avatar />
          <h2 className="text-center text-4xl">Jericho Pio</h2>
          <div>
            <button
              className="flex btn bg-neutral-300 mx-auto"
              onClick={() => navigate("/createpost")}
            >
              Create a post
            </button>
          </div>
        </div>
        {/* Show post if user has else return a text saying you have no posts*/}
      </div>
      <Footer />
    </div>
  );
}
