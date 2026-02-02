import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Bloglist from "../components/Bloglist";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 space-y-4 max-w-5xl">
        <Bloglist />
        <Bloglist />
        <Bloglist />
      </div>
      <Footer />
    </div>
  );
}
