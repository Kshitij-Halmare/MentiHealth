import React, { useContext } from 'react'; 
import { BlogContext } from '../../Editor/BlogId'; 
import { FaTimesCircle } from 'react-icons/fa'; 
import CommentFeild from './CommentFeild';
import { UserContext } from '../../Context/UserProvider';
export const fetchComment = async ({ blog_id }) => {   
  const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/getCommentData`, {       
    method: 'POST',       
    headers: {           
      'Content-Type': 'application/json',       
    },       
    body: JSON.stringify({ blog_id }),   
  });    

  const resData = await response.json();   
  if (resData.success) {       
    const data = resData.data;       
    return {            
      results:data       
    };   
  } else {       
    console.error('Error fetching comments:', resData.message);       
    return { results: [] };  // Return empty array on error   
  } 
};

function ComponentsContainer() {   
  const {     
    commentsWrapper,     
    setCommentWrapper,     
    blog_id,     
    blog: { title, description, banner, content, publishedAt, tags, activity, author },   
  } = useContext(BlogContext);
  const {user}=useContext(UserContext);
  return (     
    <div       
      className={`fixed rounded-xl ${
        commentsWrapper
          ? "top-0 sm:right-[0]"
          : "top-[200%] sm:right-[-100%]"
      } duration-700 z-50 bg-white shadow-2xl p-8 px-4 sm:px-8 md:px-16 overflow-y-auto overflow-x-hidden max-sm:w-full sm:w-[70%] md:w-[30%] min-w-[350px] h-full`}
    >       
      <div className="relative flex justify-between items-start">         
        <div>           
          <h1 className="text-xl font-medium">Comments</h1>           
          <p className="text-lg mt-2 w-full sm:w-[70%] text-gray-800 line-clamp-1">{title}</p>         
        </div>         
        <button onClick={() => { setCommentWrapper(false) }}>           
          <FaTimesCircle className="text-slate-600 hover:text-slate-800 flex items-center text-2xl" />         
        </button>       
      </div>       
      <hr className="border-gray-400 my-8 w-full sm:w-[120%] -ml-10" />       
      <CommentFeild action="Comment"/>     
    </div>   
  ); 
}

export default ComponentsContainer;
