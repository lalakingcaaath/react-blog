import type { Blogposts } from "../types/Blogposts";
import supabase from "../config/supabaseClient";

type BloglistProps = {
  post: Blogposts;
};

export default function Bloglist({ post }: BloglistProps) {
  const { data } = supabase.storage
    .from("blog-post")
    .getPublicUrl(post.imageUpload || "");

  const fullImageUrl = data.publicUrl;

  return (
    <div className="card lg:card-side bg-base-100 shadow-sm border border-base-200 overflow-hidden">
      <figure className="lg:w-1/3 w-full h-56">
        {post.imageUpload ? (
          <img
            src={fullImageUrl}
            alt={post.title || "Blog post"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center">
            <span>No Image</span>
          </div>
        )}
      </figure>

      <div className="card-body lg:w-2/3">
        <div className="flex justify-between items-start">
          <h2 className="card-title text-2xl font-bold">
            {post.title || "Untitled"}
          </h2>
          <div className="badge badge-outline text-xs">Blog</div>
        </div>

        <p className="text-gray-600 line-clamp-3 my-2">{post.content}</p>

        <div className="card-actions justify-between items-center mt-4">
          <small className="text-gray-400">
            {new Date(post.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </small>
          <button className="btn btn-primary btn-sm md:btn-md">
            Read more
          </button>
        </div>
      </div>
    </div>
  );
}
