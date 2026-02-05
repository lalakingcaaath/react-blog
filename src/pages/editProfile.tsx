import Navbar from "../components/Navbar";
import PreviousButton from "../components/PreviousButton";
import Footer from "../components/Footer";

export default function EditProfile() {
  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />
      <div className="container mx-auto p-4 space-y-6 max-w-5xl grow">
        <PreviousButton />
      </div>

      <Footer />
    </div>
  );
}
