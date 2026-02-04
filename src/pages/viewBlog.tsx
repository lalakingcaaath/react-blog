import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import type { Blogposts } from "../types/Blogposts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ViewPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Blogposts | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("blog-post")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
      } else if (data) {
        setPost(data);

        if (data.imageUpload) {
          const { data: imgData } = supabase.storage
            .from("blog-post")
            .getPublicUrl(data.imageUpload);
          setImageUrl(imgData.publicUrl);
        }
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 gap-4">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />

      <main className="container mx-auto p-4 max-w-4xl grow">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm mb-4 gap-2 pl-0 hover:bg-transparent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to posts
        </button>

        <div className="card bg-base-100 shadow-xl overflow-hidden">
          {imageUrl && (
            <figure className="w-full h-64 md:h-96 relative">
              <img
                src={imageUrl}
                alt={post.title || "Blog Post"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <div className="badge badge-primary mb-2">Blog</div>
              </div>
            </figure>
          )}

          <div className="card-body md:p-10">
            {/* Title & Date */}
            <div className="mb-6 border-b border-base-200 pb-4">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-base-content">
                {post.title || "Untitled"}
              </h1>
              <p className="text-sm text-base-content/60 flex items-center gap-2">
                <span>Published on</span>
                <time className="font-medium">
                  {new Date(post.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </p>
            </div>
            <article className="prose prose-lg max-w-none text-base-content/80 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
