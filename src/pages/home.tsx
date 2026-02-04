import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Bloglist from "../components/Bloglist";
import supabase from "../config/supabaseClient";
import type { Blogposts } from "../types/Blogposts";

export default function Home() {
  const [posts, setPosts] = useState<Blogposts[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog-post")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error:", error.message);
      } else if (data) {
        setPosts(data as Blogposts[]);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 space-y-6 max-w-5xl grow">
        {posts.map((post) => (
          <Bloglist key={post.id} post={post} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
