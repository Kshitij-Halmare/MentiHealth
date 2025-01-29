// import React, { useContext } from 'react';
// import logo from "../../assets/sm_5b29ed73cf5c8.jpg";
// import { EditorContext } from '../../Pages/Editor/EditorPage.jsx';
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// function BlogEditorNavbar() {
//   const context = useContext(EditorContext);
//   const blog = context?.blog || {};
//   const setBlog = context?.setBlog;
//   const textEditor = context?.textEditor;
//   console.log(textEditor);
//   const setEditorState = context?.setEditorState;
//   const blogTitle = blog?.title || "Untitled Blog";
//   const navigate = useNavigate();

//   const handlePublish = () => {
//     if (!blog?.title?.trim()) {
//       return toast.error("Write a blog title to publish it.");
//     }
//     if (!blog?.banner?.trim()) {
//       return toast.error("Upload a blog banner to publish it.");
//     }

//     if (textEditor) {
//             if (data?.blocks?.length) {
//               setBlog?.({ ...blog, content: data });
//               setEditorState?.("publish");
//             } else {
//               toast.error("Write something in your blog to publish it.");
//             }
//       } 
//     }


//   const handleCancel = () => {
//     toast("Edit cancelled.");
//     // Additional cancel logic can be added here
//   };

//   return (
//     <nav className="z-10 flex justify-between h-20 sticky shadow-md py-2 top-0 px-4 items-center bg-white">
//       <div className="flex items-center">
//         <img
//           src={logo}
//           alt="Logo"
//           className="h-16 w-16 object-contain"
//           onClick={() => navigate("/")}
//         />
//         <p className="pl-4 text-lg font-serif whitespace-nowrap">{blogTitle}</p>
//       </div>
//       <div className="flex gap-2">
//         <button
//           className="p-2 bg-black text-white px-3 hover:bg-slate-900 rounded-full font-serif hover:scale-105 transition-transform duration-200"
//           onClick={handlePublish}
//           aria-label="Publish Blog"
//         >
//           Publish
//         </button>
//         <button
//           className="p-2 bg-slate-300 text-black px-3 hover:bg-slate-400 rounded-full font-serif hover:scale-105 transition-transform duration-200"
//           onClick={handleCancel}
//           aria-label="Cancel Blog Edit"
//         >
//           Cancel
//         </button>
//       </div>
//     </nav>
//   );
// }

// export default BlogEditorNavbar;

import { useContext } from "react";
import { EditorContext } from "../../Editor/EditorPage.jsx";
import toast from "react-hot-toast";
import logo from "../../assets/sm_5b29ed73cf5c8.jpg";
import React from 'react'
import { useNavigate } from "react-router-dom";
import UserProvider, { UserContext } from "../../Context/UserProvider.jsx";

function BlogEditorNavbar() {
  const { blog, setBlog,textEditor,setTextEditor,setEditorState } = useContext(EditorContext);
  const {user}=useContext(UserContext);
  const blogTitle=blog.title || "New Blog"
  const navigate=useNavigate();
  const handlePublish=()=>{
    if(!blog.banner.length){
      return toast.error("Blog Banner Required");
    }
    if(!blog.title.length){
      return toast.error("Blog title Required ");
    }
    if(textEditor.isReady){
      textEditor.save().then(data=>{
        if(data.blocks.length){
          setBlog({...blog,content:data});
          setEditorState("publish")
        }else{
          return toast.error("Write Something to publish")
        }
      }).catch((err)=>{
        console.error(err);
      })
    }
  }
  const handleDraft = async () => {
    // console.log(user);
    if (!blog.banner.length) {
      return toast.error("Blog Banner Required");
    }
    if (!blog.title.length) {
      return toast.error("Blog title Required");
    }

    try {
      console.log(user._id);
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/createDraft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ blog, authorId: user._id, draft: true, blog_id: blog.blog_id })
      });

      const resData = await response.json();

      if (resData.success) {
        toast.success("Your blog is being saved as draft.");
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      console.error("Error saving blog as draft:", error);
      toast.error("An error occurred while saving your blog. Please try again.");
    }
  };
  return (
    <nav className="z-10 flex justify-between  h-20 sticky shadow-md py-2 top-0 px-4 items-center bg-white">
      <div className="flex items-center">
        <h1 className="md:text-3xl text-xl font-serif font-semibold text-balance" onClick={()=>{navigate("/")}}>
          OPEN HEART
        </h1>
        <p className="md:pl-4 px-2  text-lg font-serif whitespace-nowrap">{`${blogTitle}`}</p>
      </div>
      <div className="flex gap-2">
        <button
          className="md:p-2 bg-black  text-white md:px-3 hover:bg-slate-900 rounded-full font-serif p-1 px-2 hover:scale-105 transition-transform duration-200"
          onClick={handlePublish}
          aria-label="Publish Blog"
        >
          Publish
        </button>
        <button
          onClick={handleDraft}
          className="md:p-2 bg-slate-300 hidden md:block text-slate-800 md:px-3 hover:bg-slate-400 rounded-full font-serif hover:scale-105 transition-transform duration-200 hover:opacity-80"
        >
          Save as Draft
        </button>
        <button
          onClick={handleDraft}
          className="md:hidden bg-slate-300 p-1  text-slate-800  hover:bg-slate-400 rounded-md font-serif hover:scale-105 transition-transform duration-200 hover:opacity-80"
        >
          Draft
        </button>
      </div>
    </nav>
  )
}

export default BlogEditorNavbar