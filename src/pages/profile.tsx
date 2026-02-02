import Navbar from "../components/Navbar";
import Avatar from "../components/Avatar";

export default function Profile() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-row container mx-auto justify-center p-4 space-y-4 max-w-5xl">
        <Avatar />
      </div>
    </div>
  );
}
