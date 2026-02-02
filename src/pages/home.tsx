import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Bloglist from "../components/Bloglist";
import supabase from "../config/supabaseClient";

export default function Home() {
  const testConnection = async () => {
    const { data, error } = await supabase
      .from("blog-post")
      .select("*")
      .limit(1);
    if (error) {
      console.error("Connection failed:", error.message);
    } else {
      console.log("Connection successful: ", data);
    }

    testConnection();
  };

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
