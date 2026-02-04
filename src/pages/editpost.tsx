import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import supabase from "../config/supabaseClient";

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("blog-post")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Error fetching post");
        navigate("/");
      } else {
        if (user?.id !== data.user_id) {
          alert("You are not authorized to edit this post.");
          navigate("/");
          return;
        }

        setTitle(data.title);
        setContent(data.content);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    let filePath = null;

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("blog-post")
        .upload(fileName, imageFile);

      if (uploadError) console.log("Error uploading image:", uploadError);
      filePath = fileName;
    }

    const updateData: any = {
      title: title,
      content: content,
    };

    if (filePath) {
      updateData.imageUpload = filePath;
    }

    const { error } = await supabase
      .from("blog-post")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.log("Error updating post:", error);
      alert("Error updating post");
    } else {
      alert("Post updated successfully!");
      navigate(`/viewpost/${id}`);
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading post data...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 space-y-4 max-w-3xl grow">
        <div className="flex flex-col gap-10 border border-black p-6 py-8 rounded-3xl">
          <h2 className="text-4xl font-bold text-center">Edit Post</h2>

          <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
            <label htmlFor="title">Blog Title</label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              className="border border-black rounded-md p-2"
            />

            <label htmlFor="description">Description</label>
            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              rows={5}
              className="border border-black rounded-lg p-2"
            ></textarea>

            <label className="text-sm text-gray-500">
              Upload new cover image (Optional)
            </label>
            <input
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              type="file"
              className="file-input"
              accept="image/jpeg, image/png"
            />

            <div className="flex gap-2 mt-4">
              <input
                type="submit"
                value="Save Changes"
                className="btn btn-neutral flex-1"
              />
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
