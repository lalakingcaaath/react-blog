import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CreatePost() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar></Navbar>
      <div className="container mx-auto p-4 space-y-4 max-w-3xl grow">
        <div className="flex flex-col gap-10 border border-black p-6 py-8 rounded-3xl">
          <h2 className="text-4xl font-bold text-center">Create a Post</h2>
          <form className="flex flex-col gap-4">
            <label htmlFor="title">Blog Title</label>
            <input
              type="text"
              placeholder="Blog Title (e.g. What's cooking?)"
              className="border border-black rounded-md p-2"
            />
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              placeholder="Your post description goes here..."
              rows={5}
              className="border border-black rounded-lg p-2"
            ></textarea>
            <input type="file" className="file-input" accept="image/jpeg" />
            <input type="submit" value="Submit" className="btn" />
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
