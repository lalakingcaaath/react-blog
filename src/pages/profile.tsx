import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Avatar from "../components/Avatar";
import Footer from "../components/Footer";
import Bloglist from "../components/Bloglist"; // We reuse your existing component!
import supabase from "../config/supabaseClient";
import type { Blogposts } from "../types/Blogposts";

export default function Profile() {
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState<Blogposts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        // 1. Get the current logged-in user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // If not logged in, redirect to login or handle accordingly
          navigate("/login");
          return;
        }

        // 2. Fetch posts ONLY belonging to this user
        // Make sure your table has a 'user_id' column!
        const { data, error } = await supabase
          .from("blog-post")
          .select("*")
          .eq("user_id", user.id) // Filter by the user's ID
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching posts:", error);
        } else if (data) {
          setMyPosts(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />

      {/* Main Container - Changed to stack on mobile, row on desktop */}
      <div className="container mx-auto p-4 max-w-5xl grow flex flex-col md:flex-row gap-8">
        {/* Left Column: User Info */}
        <div className="md:w-1/3 flex flex-col gap-6">
          <div className="card bg-base-100 shadow-xl p-6 flex flex-col items-center text-center">
            <Avatar />
            <h2 className="text-3xl font-bold mt-4">Jericho Pio</h2>
            <p className="text-gray-500 mb-6">Full Stack Developer</p>
            <button
              className="btn btn-primary w-full"
              onClick={() => navigate("/createpost")}
            >
              + Create a post
            </button>
          </div>
        </div>

        <div className="md:w-2/3 mt-9">
          <h3 className="text-2xl font-bold mb-4">My Posts</h3>

          {loading ? (
            <div className="flex justify-center p-10">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : myPosts.length > 0 ? (
            <div className="space-y-4">
              {myPosts.map((post) => (
                <Bloglist key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="card bg-base-100 shadow-sm p-10 text-center border-dashed border-2 border-base-300">
              <h3 className="text-lg font-bold text-gray-500">
                You haven't posted yet
              </h3>
              <p className="py-4 text-gray-400">
                Share your first story with the world!
              </p>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => navigate("/createpost")}
              >
                Start Writing
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
