import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import supabase from "../config/supabaseClient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const user_id = useSelector((state: RootState) => state.user.id);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user_id) {
      alert("You must be logged in to post.");
      return;
    }

    let filePath = null;

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;

      const { data, error } = await supabase.storage
        .from("blog-post")
        .upload(fileName, imageFile);

      if (error) {
        console.log("Error uploading image:", error);
        alert("Failed to upload image.");
        return;
      } else {
        console.log("Image uploaded successfully:", data);
        filePath = fileName;
      }
    }

    const { error } = await supabase.from("blog-post").insert([
      {
        title: title,
        content: content,
        imageUpload: filePath,
        user_id: user_id,
      },
    ]);

    if (error) {
      console.log("Error creating blog post:", error);
      alert("Error creating post: " + error.message);
    } else {
      console.log("Blog post created successfully");
      alert("Blog post created!");
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />
      <div className="container mx-auto p-4 space-y-4 max-w-3xl grow">
        <div className="flex flex-col gap-10 bg-base-100 shadow-xl p-6 py-8 rounded-3xl mt-10">
          <h2 className="text-4xl font-bold text-center">Create a Post</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label htmlFor="title" className="font-semibold">
              Blog Title
            </label>
            <input
              id="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="Blog Title (e.g. What's cooking?)"
              className="input input-bordered w-full"
              required
            />

            <label htmlFor="description" className="font-semibold">
              Description
            </label>
            <textarea
              id="description"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="Your post description goes here..."
              rows={5}
              className="textarea textarea-bordered text-base"
              required
            ></textarea>

            <label className="font-semibold">Cover Image (Optional)</label>
            <input
              key={resetKey}
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              type="file"
              className="file-input file-input-bordered w-full"
              accept="image/jpeg, image/png, image/webp"
            />

            <input
              type="submit"
              value="Publish Post"
              className="btn btn-neutral mt-4"
              disabled={!title || !content}
            />
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
