import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Bloglist from "../components/Bloglist";
import supabase from "../config/supabaseClient";
import type { Blogposts } from "../types/Blogposts";
import type { UserProfiles } from "../types/userProfiles";

export default function Profile() {
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState<Blogposts[]>([]);
  const [profile, setProfile] = useState<UserProfiles | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        // Removed 'avatar' from the query since we don't use it anymore
        const profilePromise = supabase
          .from("user_profiles")
          .select("firstName, lastName")
          .eq("id", user.id)
          .single();

        const postsPromise = supabase
          .from("blog-post")
          .select(
            `
            *,
            user_profiles (firstName, lastName)
          `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        const [profileResponse, postsResponse] = await Promise.all([
          profilePromise,
          postsPromise,
        ]);

        if (profileResponse.data) {
          setProfile(profileResponse.data as UserProfiles);
        }

        if (postsResponse.data) {
          setMyPosts(postsResponse.data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [navigate]);

  const displayName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
    : "Anonymous User";

  const initial = profile?.firstName
    ? profile.firstName.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto p-4 max-w-5xl grow flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex flex-col gap-6">
          <div className="card bg-base-100 shadow-xl p-6 flex flex-col items-center text-center">
            {/* --- STATIC AVATAR (Initials Only) --- */}
            <div className="avatar placeholder mb-2">
              <div className="bg-neutral text-neutral-content rounded-full w-32 h-32 flex items-center justify-center text-5xl font-bold ring ring-primary ring-offset-base-100 ring-offset-2">
                <span>{initial}</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-4">
              {loading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                displayName || "Anonymous User"
              )}
            </h2>

            {/* Removed Edit Profile Button */}
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
                You haven't posted any blogs yet
              </h3>
              <p className="py-4 text-gray-400">
                Share your first blog with the world!
              </p>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => navigate("/createpost")}
              >
                Create a blog
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
