import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Bloglist from "../components/Bloglist";
import supabase from "../config/supabaseClient";
import type { Blogposts } from "../types/Blogposts";

const items_per_page = 5;

export default function Home() {
  const [posts, setPosts] = useState<Blogposts[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (pageNumber: number) => {
    setLoading(true);

    const from = (pageNumber - 1) * items_per_page;
    const to = from + items_per_page - 1;

    const { data, error, count } = await supabase
      .from("blog-post")
      .select(
        `
          *,
          user_profiles (firstName, lastName)
        `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Fetch error:", error.message);
    } else if (data) {
      setPosts(data as Blogposts[]);
      if (count !== null) setTotalCount(count);
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (page * items_per_page < totalCount) {
      setPage((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto p-4 space-y-6 max-w-5xl grow">
        <h1 className="text-3xl font-bold mt-6 mb-4 text-center md:text-left">
          Recent Posts
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <Bloglist key={post.id} post={post} />
            ))}

            {posts.length > 0 && (
              <div className="flex flex-col items-center mt-10 gap-2">
                <div className="join grid grid-cols-2 shadow-sm">
                  <button
                    className="join-item btn btn-outline btn-sm md:btn-md"
                    onClick={handlePrev}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="join-item btn btn-outline btn-sm md:btn-md"
                    onClick={handleNext}
                    disabled={page * items_per_page >= totalCount}
                  >
                    Next
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  Page {page} of {Math.ceil(totalCount / items_per_page)}
                </span>
              </div>
            )}

            {posts.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No posts found.
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
