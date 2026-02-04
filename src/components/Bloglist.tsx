import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
// 👇 IMPORT THE SHARED TYPE
import type { Blogposts } from "../types/Blogposts";

type BloglistProps = {
  post: Blogposts;
};

export default function Bloglist({ post }: BloglistProps) {
  const navigate = useNavigate();

  const { data } = supabase.storage
    .from("blog-post")
    .getPublicUrl(post.imageUpload || "");

  const fullImageUrl = data.publicUrl;

  const authorName = post.user_profiles
    ? `${post.user_profiles.firstName} ${post.user_profiles.lastName}`
    : "Unknown Author";

  return (
    <div className="card lg:card-side bg-base-100 shadow-sm border border-base-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <figure className="lg:w-1/3 w-full h-56 relative bg-base-200">
        {post.imageUpload ? (
          <img
            src={fullImageUrl}
            alt={post.title || "Blog post"}
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
            {post.title || "Untitled"}
          </h2>
          <div className="badge badge-primary badge-outline text-xs shrink-0">
            Blog
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-base-content/70 mb-3">
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-6 h-6 flex items-center justify-center bg-base-300">
              <span className="text-xs font-bold">{authorName.charAt(0)}</span>
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
          {post.content}
        </p>

        <div className="card-actions justify-end items-center mt-auto border-t border-base-200 pt-4">
          <button
            className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-primary hover:bg-base-200"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/viewpost/${post.id}`);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Comment
          </button>

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
