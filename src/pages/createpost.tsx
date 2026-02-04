import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resetKey, setResetKey] = useState(0);

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in to create a post.");
        navigate("/login");
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // 1. Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to post!");
      return;
    }

    let filePath = null;

    if (imageFile) {
      // Added Date.now() to ensure unique filenames
      const fileName = `${Date.now()}_${imageFile.name}`;

      const { data, error } = await supabase.storage
        .from("blog-post")
        .upload(fileName, imageFile || undefined);

      if (error) {
        console.log("Error uploading image:", error);
      } else {
        console.log("Image uploaded successfully:", data);
      }
      filePath = fileName;
    }

    // 2. Insert post with user_id
    const { error } = await supabase.from("blog-post").insert([
      {
        title: title,
        content: content,
        imageUpload: filePath,
        user_id: user.id, // <--- This links it to your profile
      },
    ]);

    if (error) {
      console.log("Error creating blog post:", error);
      alert("Error creating post");
    } else {
      console.log("Blog post created successfully");
      alert("Blog post created");
      navigate("/"); // Go back home after success
    }

    // Reset form
    setTitle("");
    setContent("");
    setImageFile(null);
    setResetKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar></Navbar>
      <div className="container mx-auto p-4 space-y-4 max-w-3xl grow">
        {/* Original Design Container */}
        <div className="flex flex-col gap-10 border border-black p-6 py-8 rounded-3xl">
          <h2 className="text-4xl font-bold text-center">Create a Post</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label htmlFor="title">Blog Title</label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="Blog Title (e.g. What's cooking?)"
              className="border border-black rounded-md p-2"
            />
            <label htmlFor="description">Description</label>
            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              name="description"
              id="description"
              placeholder="Your post description goes here..."
              rows={5}
              className="border border-black rounded-lg p-2"
            ></textarea>
            <input
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              key={resetKey}
              type="file"
              className="file-input"
              accept="image/jpeg, image/png"
            />
            <input type="submit" value="Submit" className="btn" />
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
