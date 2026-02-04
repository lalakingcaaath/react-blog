import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const user_id = useSelector((state: RootState) => state.user.id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      setSelectedFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const removeImage = (indexToRemove: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );

    URL.revokeObjectURL(previewUrls[indexToRemove]);
    setPreviewUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user_id) {
      alert("You must be logged in to post.");
      return;
    }

    const uploadedPaths: string[] = [];

    if (selectedFiles.length > 0) {
      try {
        const uploadPromises = selectedFiles.map(async (file) => {
          const fileName = `${Date.now()}_${file.name}`;
          const { error } = await supabase.storage
            .from("blog-post")
            .upload(fileName, file);

          if (error) throw error;
          return fileName;
        });

        const results = await Promise.all(uploadPromises);
        uploadedPaths.push(...results);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload images.");
        return;
      }
    }

    const { error } = await supabase.from("blog-post").insert([
      {
        title: title,
        content: content,
        images: uploadedPaths,
        user_id: user_id,
      },
    ]);

    if (error) {
      console.log("Error creating blog post:", error);
      alert("Error creating post: " + error.message);
    } else {
      alert("Blog post created!");
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />
      <div className="container mx-auto p-4 space-y-4 max-w-3xl grow">
        <div className="flex flex-col gap-6 bg-base-100 shadow-xl p-6 py-8 rounded-3xl mt-10">
          <h2 className="text-4xl font-bold text-center mb-4">Create a Post</h2>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label htmlFor="title" className="label font-semibold">
                <span className="label-text">Blog Title</span>
              </label>
              <input
                id="title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Blog Title"
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
                placeholder="Your post description..."
                rows={6}
                className="textarea textarea-bordered text-base w-full"
                required
              ></textarea>
            </div>

            <div className="form-control w-full">
              <label className="label font-semibold">
                <span className="label-text">Images (Optional)</span>
              </label>

              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full mb-4"
                accept="image/jpeg, image/png, image/webp"
              />

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative group w-full h-32 bg-base-200 rounded-lg overflow-hidden border border-base-300"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="btn btn-circle btn-xs btn-error absolute top-1 right-1 shadow-md opacity-90 hover:opacity-100"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              type="submit"
              value={
                selectedFiles.length > 0
                  ? `Publish Post (${selectedFiles.length} images)`
                  : "Publish Post"
              }
              className="btn btn-neutral mt-4 w-full md:w-auto md:self-end"
              disabled={!title || !content}
            />
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
