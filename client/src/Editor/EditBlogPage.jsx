import React, { useContext, useEffect, useState } from 'react';
import toast from "react-hot-toast";
import blogBannerPlaceholder from "../assets/360_F_588335931_SG8mqLyvPnIQZL6vlkDtDhtJacYDoFuQ.jpg";
import BlogEditorNavbar from '../Components/Editor/BlogEditorNavbar';
import { EditorContext } from './EditorPage';
import EditorJS from '@editorjs/editorjs';
import { editorTools } from './Tools';
import { UserContext } from '../Context/UserProvider'; // Corrected import path

function EditBlogPage() {
  const { blog, setBlog, textEditor, setTextEditor } = useContext(EditorContext);
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>; // Return loading state while the user context is being fetched
  }

  if (!user) {
    return <div>Please log in to edit the blog.</div>; // Handle the case when the user is not logged in
  }

  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading,setImageLoading]=useState(false);
  useEffect(() => {
    setTextEditor(new EditorJS({
      holder: "textEditor",
      data: {
        blocks: blog.content[0] || "",  // Pass blocks correctly
      },
      tools: editorTools,
      placeholder: "Start Writing a new Journey ..."
    }));
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setImageLoading(true);

      // Display the image preview immediately after selection
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set preview for image
      };
      reader.readAsDataURL(file);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/blog/upload-blog-banner/${user._id}`, // Use `user.id` or a similar property to identify the user
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      // Updating the blog banner in the context state
      setBlog((prevBlog) => ({
        ...prevBlog,
        banner: data.bannerImageUrl,
      }));

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setImageLoading(false);
    }
  };
console.log(user);
  return (
    <>
      <BlogEditorNavbar />
      <section className="bg-gradient-to-tr from-pink-200 via-white to-pink-200">
        <div className="mx-auto max-w-[900px] bg-white shadow-lg p-6 w-full">
          <div className="relative aspect-video bg-white border-4 border-gray hover:opacity-80">
            <label htmlFor="uploadImage" className="cursor-pointer">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 font-semibold">Uploading...</p>
                </div>
              ) : (
                <>
                  <img
                    src={imagePreview || blog.banner || blogBannerPlaceholder}
                    alt="Blog Banner"
                    className="md:min-w-[800px] w-full h-full object-cover rounded-lg"
                  />
                  {!imagePreview && (
                    <div className="absolute text-gray-600 font-bold font-serif top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="md:text-4xl text-2xl">Upload</p>
                      <p className="md:text-6xl text-3xl">Blog Banner</p>
                    </div>
                  )}
                </>
              )}
              <input
                id="uploadImage"
                type="file"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <div className="my-4">
            <input
              type="text"
              value={blog.title}
              onChange={(e) =>
                setBlog((prevBlog) => ({ ...prevBlog, title: e.target.value }))
              }
              placeholder="Enter Blog Title"
              className="w-full md:px-4 md:py-4 md:text-4xl text-xl px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="textEditor" id="textEditor"></div>
        </div>
      </section>
    </>
  );
}

export default EditBlogPage;
