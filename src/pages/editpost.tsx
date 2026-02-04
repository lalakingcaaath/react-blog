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
  const [loading, setLoading] = useState(true);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

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
        if (data.images && Array.isArray(data.images)) {
          setExistingImages(data.images);
        }
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...selectedFiles]);

      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setNewPreviews((prev) => [...prev, ...urls]);
    }
  };

  const removeNewFile = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const markForDeletion = (path: string) => {
    setExistingImages((prev) => prev.filter((p) => p !== path));
    setImagesToDelete((prev) => [...prev, path]);
  };

  const getPublicUrl = (path: string) =>
    supabase.storage.from("blog-post").getPublicUrl(path).data.publicUrl;

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (imagesToDelete.length > 0) {
      await supabase.storage.from("blog-post").remove(imagesToDelete);
    }

    const uploadedPaths: string[] = [];
    if (newFiles.length > 0) {
      for (const file of newFiles) {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("blog-post")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          continue;
        }
        uploadedPaths.push(fileName);
      }
    }

    const finalImages = [...existingImages, ...uploadedPaths];

    const { error } = await supabase
      .from("blog-post")
      .update({
        title: title,
        content: content,
        images: finalImages,
      })
      .eq("id", id);

    if (error) {
      alert("Error updating post");
    } else {
      alert("Post updated successfully!");
      navigate(`/viewpost/${id}`);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto p-4 space-y-4 max-w-3xl grow">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost gap-2 pl-0 hover:bg-transparent self-start"
        >
          ← Back
        </button>

        <div className="flex flex-col gap-6 bg-base-100 shadow-xl p-6 py-8 rounded-3xl mt-2">
          <h2 className="text-4xl font-bold text-center mb-4">Edit Post</h2>

          <form className="flex flex-col gap-6" onSubmit={handleUpdate}>
            <div className="form-control w-full">
              <label htmlFor="title" className="label font-semibold">
                <span className="label-text">Blog Title</span>
              </label>
              <input
                id="title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full">
              <label htmlFor="description" className="label font-semibold">
                <span className="label-text">Description</span>
              </label>
              <textarea
                id="description"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                rows={6}
                className="textarea textarea-bordered text-base w-full"
                required
              ></textarea>
            </div>

            <div className="form-control w-full">
              <label className="label font-semibold">
                <span className="label-text">Manage Images</span>
              </label>

              <div className="bg-base-200 rounded-2xl p-4 border-2 border-dashed border-base-300">
                {existingImages.length > 0 && (
                  <div className="mb-6">
                    <span className="text-xs font-bold text-gray-500 mb-3 block uppercase tracking-wide">
                      Current Images
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {existingImages.map((path, idx) => (
                        <div
                          key={idx}
                          className="relative group w-full h-32 rounded-xl overflow-hidden shadow-sm border border-base-300"
                        >
                          <img
                            src={getPublicUrl(path)}
                            alt="Existing"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => markForDeletion(path)}
                            className="btn btn-circle btn-xs btn-error absolute top-2 right-2 shadow-sm text-white"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-control w-full mb-4">
                  <label className="label pt-0">
                    <span className="label-text-alt">Add more images</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full"
                    accept="image/jpeg, image/png, image/webp"
                  />
                </div>

                {newPreviews.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-success mb-3 block uppercase tracking-wide">
                      New Uploads Pending
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {newPreviews.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative group w-full h-32 rounded-xl overflow-hidden shadow-sm border-2 border-success"
                        >
                          <img
                            src={url}
                            alt="New Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewFile(idx)}
                            className="btn btn-circle btn-xs btn-neutral absolute top-2 right-2 shadow-sm text-white"
                            title="Remove upload"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <input
              type="submit"
              value="Save Changes"
              className="btn btn-neutral mt-4 w-full md:w-auto md:self-end"
            />
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
