import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import type { Blogposts } from "../types/Blogposts";

type BloglistProps = {
  post: Blogposts;
};

export default function Bloglist({ post }: BloglistProps) {
  const navigate = useNavigate();

  if (!post) return null;

  let fullImageUrl = null;
  if (post.images && post.images.length > 0) {
    const { data } = supabase.storage
      .from("blog-post")
      .getPublicUrl(post.images[0]);
    fullImageUrl = data.publicUrl;
  }

  const authorName = post.user_profiles
    ? `${post.user_profiles.firstName} ${post.user_profiles.lastName}`
    : "Unknown Author";

  const title = post.title || "Untitled";
  const content = post.content || "";

  return (
    <div className="card lg:card-side bg-base-100 shadow-sm border border-base-200 overflow-hidden hover:shadow-md transition-shadow duration-300 mb-6">
      <figure className="lg:w-1/3 w-full h-56 relative bg-base-200">
        {fullImageUrl ? (
          <img
            src={fullImageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="text-neutral-content w-full h-full flex items-center justify-center bg-neutral">
            <span className="font-bold opacity-50">No Image</span>
          </div>
        )}
      </figure>

      <div className="card-body lg:w-2/3 p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="card-title text-2xl font-bold text-base-content line-clamp-1">
            {title}
          </h2>
          <div className="badge badge-primary badge-outline text-xs shrink-0">
            Blog
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-base-content/70 mb-3">
          <div className="avatar placeholder">
            <div className="text-neutral-content rounded-full w-6 h-6 flex items-center justify-center bg-neutral">
              <span className="text-xs font-bold">
                {authorName?.charAt(0) || "?"}
              </span>
            </div>
          </div>
          <span className="font-semibold">{authorName}</span>
          <span>•</span>
          <time>
            {new Date(post.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>

        <p className="text-base-content/80 line-clamp-2 mb-4 text-sm leading-relaxed">
          {content}
        </p>

        <div className="card-actions justify-end items-center mt-auto border-t border-base-200 pt-4">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/viewpost/${post.id}`)}
          >
            Read more
          </button>
        </div>
      </div>
    </div>
  );
}
