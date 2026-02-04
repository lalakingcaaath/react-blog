import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import type { Blogposts } from "../types/Blogposts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CommentsSection from "../components/CommentSection";

export default function ViewPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Blogposts | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post? This cannot be undone.",
    );

    if (!confirmDelete) return;

    if (post?.imageUpload) {
      await supabase.storage.from("blog-post").remove([post.imageUpload]);
    }

    const { error } = await supabase.from("blog-post").delete().eq("id", id);

    if (error) {
      console.log("Error deleting:", error);
      alert("Error deleting post");
    } else {
      alert("Post deleted!");
      navigate("/");
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchPostAndUser = async () => {
      const { data: postData, error } = await supabase
        .from("blog-post")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
      } else if (postData) {
        setPost(postData);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && user.id === postData.user_id) {
          setIsOwner(true);
        }

        if (postData.imageUpload) {
          const { data: imgData } = supabase.storage
            .from("blog-post")
            .getPublicUrl(postData.imageUpload);
          setImageUrl(imgData.publicUrl);
        }
      }
      setLoading(false);
    };

    fetchPostAndUser();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (!post) return <div>Post not found</div>;

  const displayDate = post.updated_at
    ? new Date(post.updated_at)
    : new Date(post.created_at);

  const dateLabel = post.updated_at ? "Last Updated" : "Published on";

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />
      <main className="container mx-auto p-4 max-w-4xl grow">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost gap-2 pl-0"
          >
            ← Back
          </button>

          {isOwner && (
            <div className="flex gap-2">
              <button
                className="btn btn-neutral"
                onClick={() => navigate(`/editpost/${post.id}`)}
              >
                Edit Post
              </button>
              <button
                className="btn btn-error text-white"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="card bg-base-100 shadow-xl overflow-hidden">
          {imageUrl && (
            <figure className="w-full h-64 md:h-96 relative">
              <img
                src={imageUrl}
                alt={post.title || "Blog Post"}
                className="w-full h-full object-cover"
              />
            </figure>
          )}
          <div className="card-body md:p-10">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2">
              {post.title}
            </h1>
            <p className="text-sm text-base-content/60 flex items-center gap-2 mb-6">
              <span className="font-semibold">{dateLabel}:</span>
              <time>
                {displayDate.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </p>
            <article className="prose prose-lg max-w-none whitespace-pre-wrap">
              {post.content}
            </article>
          </div>
        </div>
        <CommentsSection postId={Number(id)} />
      </main>
      <Footer />
    </div>
  );
}
