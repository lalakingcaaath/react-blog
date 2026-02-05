import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RemoveButton from "./RemoveButton";
import supabase from "../config/supabaseClient";
import type { Comments } from "../types/comment";

type CommentsSectionProps = {
  postId: number;
};

const getPublicUrl = (path: string | null) => {
  if (!path) return null;
  return supabase.storage.from("blog-post").getPublicUrl(path).data.publicUrl;
};

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const user = useSelector((state: any) => state.user);

  const [comments, setComments] = useState<Comments[]>([]);
  const [newComment, setNewComment] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editImageRemoved, setEditImageRemoved] = useState(false);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("blog_comment")
      .select(`*, user_profiles (firstName, lastName)`)
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching comments:", error);
    else setComments(data as Comments[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && !imageFile) return;

    if (!user?.id) {
      alert("You must be logged in to comment.");
      return;
    }

    let imagePath = null;

    if (imageFile) {
      const fileName = `comments/${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("blog-post")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return;
      }
      imagePath = fileName;
    }

    const { error } = await supabase.from("blog_comment").insert({
      post_id: postId,
      user_id: user.id,
      comment: newComment,
      comment_image: imagePath,
    });

    if (error) {
      console.error(error);
      alert("Failed to post comment");
    } else {
      setNewComment("");
      setImageFile(null);
      fetchComments();
    }
  };

  const startEditing = (comment: Comments) => {
    setEditingId(comment.id);
    setEditContent(comment.comment);
    setEditImageRemoved(false);
  };

  const saveEdit = async (id: number, originalImagePath: string | null) => {
    const isImageGone = !originalImagePath || editImageRemoved;
    if (!editContent.trim() && isImageGone) {
      alert("Comment cannot be empty");
      return;
    }

    const updates: any = { comment: editContent };

    if (originalImagePath && editImageRemoved) {
      updates.comment_image = null;

      await supabase.storage.from("blog-post").remove([originalImagePath]);
    }

    const { error } = await supabase
      .from("blog_comment")
      .update(updates)
      .eq("id", id);

    if (error) {
      alert("Failed to update comment");
    } else {
      setEditingId(null);
      setEditImageRemoved(false);
      fetchComments();
    }
  };

  const deleteComment = async (id: number, imagePath?: string) => {
    if (!window.confirm("Delete this comment?")) return;

    if (imagePath) {
      await supabase.storage.from("blog-post").remove([imagePath]);
    }

    const { error } = await supabase.from("blog_comment").delete().eq("id", id);

    if (error) alert("Failed to delete");
    else fetchComments();
  };

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

      <form
        onSubmit={handlePostComment}
        className="mb-10 bg-base-100 p-4 rounded-xl shadow-sm border border-base-200"
      >
        <textarea
          className="textarea textarea-bordered w-full focus:outline-none focus:border-primary mb-2 text-base"
          placeholder="What are your thoughts?"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        {imageFile && (
          <div className="flex flex-col items-start mt-3 mb-6">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="h-24 w-24 object-cover rounded-xl border border-base-300 shadow-sm"
            />
            <RemoveButton onClick={() => setImageFile(null)} />
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <div className="tooltip" data-tip="Attach Image">
            <label className="btn btn-circle btn-ghost btn-sm text-base-content/70 hover:bg-base-200">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </label>
          </div>

          <button
            className="btn btn-primary btn-sm px-6"
            disabled={!newComment.trim() && !imageFile}
          >
            Post Comment
          </button>
        </div>
      </form>

      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 italic text-center py-4">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((item) => {
            const authorName = item.user_profiles
              ? `${item.user_profiles.firstName} ${item.user_profiles.lastName}`
              : "Unknown User";

            const isAuthor = user?.id === item.user_id;

            return (
              <div
                key={item.id}
                className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 group"
              >
                <div className="avatar placeholder h-fit">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-10 h-10 flex items-center justify-center bg-base-300">
                    <span className="text-lg font-bold text-base-content/70">
                      {authorName.charAt(0)}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base-content">
                        {authorName}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <time className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </time>
                    </div>

                    {isAuthor && editingId !== item.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(item)}
                          className="text-xs text-blue-500 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            deleteComment(item.id, item.comment_image)
                          }
                          className="text-xs text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {editingId === item.id ? (
                    <div className="mt-2 bg-base-200/50 p-3 rounded-lg">
                      <textarea
                        className="textarea textarea-bordered w-full mb-2"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />

                      {item.comment_image && !editImageRemoved && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Attached Image:
                          </p>
                          <div className="flex flex-col items-start">
                            <img
                              src={getPublicUrl(item.comment_image) || ""}
                              alt="Attachment"
                              className="h-24 w-24 object-cover rounded-xl border border-base-300 shadow-sm"
                            />
                            <RemoveButton
                              onClick={() => setEditImageRemoved(true)}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(item.id, item.comment_image)}
                          className="btn btn-xs btn-primary"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-xs btn-ghost"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-base-content/80 text-sm leading-relaxed whitespace-pre-wrap">
                        {item.comment}
                      </p>

                      {item.comment_image && (
                        <div className="mt-3">
                          <img
                            src={getPublicUrl(item.comment_image) || ""}
                            alt="Comment attachment"
                            className="rounded-lg max-h-60 max-w-full object-cover border border-base-200 cursor-pointer hover:opacity-95"
                            onClick={() =>
                              window.open(
                                getPublicUrl(item.comment_image) || "",
                                "_blank",
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
