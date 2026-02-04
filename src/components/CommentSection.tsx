import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import type { Comments } from "../types/comment";

type CommentsSectionProps = {
  postId: number;
};

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comments[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("blog_comment")
      .select(
        `
        *,
        user_profiles (firstName, lastName)
      `,
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data as Comments[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }

    const { error } = await supabase.from("blog_comment").insert({
      post_id: postId,
      user_id: user.id,
      comment: newComment,
    });

    if (error) {
      console.error(error);
      alert("Failed to post comment");
    } else {
      setNewComment("");
      fetchComments();
    }
  };

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

      <form onSubmit={handlePostComment} className="mb-10">
        <div className="form-control">
          <textarea
            className="textarea textarea-bordered h-24 w-full focus:outline-none focus:border-primary"
            placeholder="What are your thoughts?"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end mt-2">
          <button
            className="btn btn-primary btn-sm"
            disabled={!newComment.trim()}
          >
            Post Comment
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {loading ? (
          <span className="loading loading-spinner text-primary"></span>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 italic text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((item) => {
            const authorName = item.user_profiles
              ? `${item.user_profiles.firstName} ${item.user_profiles.lastName}`
              : "Unknown User";

            return (
              <div
                key={item.id}
                className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="avatar placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-10 h-10 flex items-center justify-center bg-base-300">
                    <span className="text-lg font-bold text-base-content/70">
                      {authorName.charAt(0)}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-base-content">
                      {authorName}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <time className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </time>
                  </div>
                  <p className="text-base-content/80 text-sm leading-relaxed mb-7">
                    {item.comment}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
