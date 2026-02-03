import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Bloglist from "../components/Bloglist";
import supabase from "../config/supabaseClient";

export default function Home() {
  useEffect(() => {
    const testConnection = async () => {
      console.log("Testing connection...");

      const { data, error } = await supabase
        .from("blog-post")
        .select("*")
        .limit(1);

      if (error) {
        console.error("Connection failed:", error.message);
      } else {
        console.log("Connection successful! Data:", data);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 space-y-4 max-w-5xl grow">
        <Bloglist />
        <Bloglist />
        <Bloglist />
      </div>
      <Footer />
    </div>
  );
}
