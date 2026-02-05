import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import type { Blogposts } from "../types/Blogposts";
import type { UserProfiles } from "../types/userProfiles";
import Navbar from "../components/Navbar";
import PreviousButton from "../components/PreviousButton";
import Footer from "../components/Footer";
import CommentsSection from "../components/CommentSection";

interface BlogPostWithAuthor extends Blogposts {
  user_profiles: UserProfiles | null;
}

export default function ViewPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPostWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const getPublicUrl = (path: string) =>
    supabase.storage.from("blog-post").getPublicUrl(path).data.publicUrl;

  const images = post?.images ?? [];
  const hasImages = images.length > 0;

  const nextImage = () => {
    if (images.length < 2) return;
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length < 2) return;
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDelete = async () => {
    if (!post) return;
    const confirmDelete = window.confirm(
      "Are you sure? This cannot be undone.",
    );
    if (!confirmDelete) return;

    if (images.length > 0) {
      await supabase.storage.from("blog-post").remove(images);
    }

    const { error } = await supabase
      .from("blog-post")
      .delete()
      .eq("id", post.id);
    if (error) {
      console.error(error);
      alert("Failed");
    } else {
      alert("Deleted");
      navigate("/");
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("blog-post")
        .select(`*, user_profiles (*)`)
        .eq("id", id)
        .single();
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      setPost(data as BlogPostWithAuthor);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && user.id === data.user_id) setIsOwner(true);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );

  if (!post) return <div className="text-center mt-10">Post not found</div>;

  const displayDate = post.updated_at
    ? new Date(post.updated_at)
    : new Date(post.created_at);
  const dateLabel = post.updated_at ? "Last Updated" : "Published on";
  const authorName = post.user_profiles
    ? `${post.user_profiles.firstName} ${post.user_profiles.lastName}`
    : "Unknown Author";

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />

      <main className="container mx-auto max-w-4xl p-4 grow">
        <div className="flex justify-between items-center mb-4">
          <PreviousButton />
          {isOwner && (
            <div className="flex gap-2">
              <button
                className="btn btn-neutral"
                onClick={() => navigate(`/editpost/${post.id}`)}
              >
                Edit
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

        <div className="card bg-base-100 shadow-xl overflow-hidden rounded-box">
          {hasImages && (
            <div className="flex flex-col">
              <figure className="relative w-full bg-base-200">
                <div className="w-full h-96 md:h-150">
                  {" "}
                  <img
                    src={getPublicUrl(images[currentImage])}
                    alt={`Slide ${currentImage + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </figure>

              {images.length > 1 && (
                <div className="flex flex-col items-center justify-center gap-4 py-4 border-b border-base-200 bg-base-100">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={prevImage}
                      className="btn btn-circle btn-outline btn-sm md:btn-md"
                    >
                      ❮
                    </button>

                    <div className="flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentImage
                              ? "w-8 bg-primary"
                              : "w-2 bg-base-300 hover:bg-base-400"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextImage}
                      className="btn btn-circle btn-outline btn-sm md:btn-md"
                    >
                      ❯
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="card-body md:p-10 pt-6">
            {" "}
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-base-content/70 mb-8 border-b pb-6">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-10">
                  <span className="text-xl">{authorName.charAt(0)}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base-content">
                  {authorName}
                </span>
                <span className="text-xs">
                  {dateLabel} {displayDate.toLocaleDateString()}
                </span>
              </div>
            </div>
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
