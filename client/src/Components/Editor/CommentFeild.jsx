import React, { useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { BlogContext } from '../../Editor/BlogId';
import CommentCard from './CommentCard';
import { UserContext } from '../../Context/UserProvider';

function CommentFeild({ action, index = undefined, replyingTo = undefined, setReplying }) {
    const { commentsWrapper, setCommentWrapper, totalParentsCommentsLoaded, setTotalParentsCommentsLoaded, blog, blog_id, setBlog, comments } = useContext(BlogContext);
    const { user } = useContext(UserContext);
    const [textArea, setTextArea] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Loading state for comment submission
    const [totalParentComment, setTotalParentComment] = useState(0); // State to hold total parent comment count

    useEffect(() => {
        if (blog?.activity?.total_parents_comments !== undefined) {
            setTotalParentComment(blog.activity.total_parents_comments);
        }
        setIsLoading(false); // Reset loading state when blog changes
    }, [blog]);

    const handleComment = async () => {
        if (user) {
            if (!textArea.trim().length) {
                return toast("Write Something to add a comment");
            }

            setIsLoading(true); // Start loading state

            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/addComment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: user._id,
                        blog_id: blog_id,
                        comment: textArea,
                        blog_author: blog.author._id,
                        replying_to: replyingTo,
                    }),
                });

                const resData = await response.json();
                console.log(resData);
                if (resData.success) {
                    setTextArea(""); // Clear text area after success
                    const newComment = {
                        comment: textArea,
                        commented_by: { name:resData.data.user.name,email:resData.data.user.email,avatar:resData.data.user.avatar },
                        childrenLevel: 0,
                        _id: resData.data._id,
                        commentedAt: resData.data.commentedAt,
                    };
                    console.log(newComment);
                    // Dynamically update blog's comments
                    setBlog(prevBlog => ({
                        ...prevBlog,
                        comments: {
                            ...prevBlog.comments,
                            results: [newComment,...prevBlog.comments.results] // Update comments with the new comment
                        }
                    }));
                    console.log("now",blog);
                    setIsLoading(false);
                    toast.success("Comment Added!");
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            } catch (error) {
                toast.error("Error submitting comment.");
                setIsLoading(false); // Ensure loading state is reset in case of error
            }
        } else {
            toast.error("Please Login to Comment");
        }
    };

    // Conditional rendering for loading state
    if (isLoading) {
        return <div>Loading...</div>;  // Show loading state during comment submission
    }

    return (
        <div>
            <textarea
                onChange={(e) => { setTextArea(e.target.value); }}
                className="pl-5 p-2 placeholder:text-gray-800 focus:outline-none hover:shadow-xl resize-none overflow-auto bg-slate-300 hover:bg-slate-100 w-full rounded-lg h-[150px]"
                value={textArea}
                placeholder="Leave a comment ..."
            />
            <button
                onClick={handleComment}
                disabled={isLoading}  // Disable button while loading
                className={`px-4 py-2 mt-2 bg-black hover:opacity-80 text-white duration-200 rounded-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? 'Submitting...' : `${action}`}
            </button>

            {/* Display comments */}
            {blog.comments.results.length > 0 ? (
                blog.comments.results.map((data, key) => <CommentCard key={key} data={data} action="Comment" />)
            ) : (
                <h1>No Comments Yet</h1>
            )}
        </div>
    );
}

export default CommentFeild;
