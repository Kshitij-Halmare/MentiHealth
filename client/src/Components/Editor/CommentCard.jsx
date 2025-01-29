import React, { useContext, useState } from 'react';
import { BlogContext } from '../../Editor/BlogId';
import CommentFeild from './CommentFeild';
import { UserContext } from '../../Context/UserProvider';
import toast from 'react-hot-toast';

let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const GetDay = (timeStamp) => {
    if (!timeStamp || !timeStamp.timeStamp) {
        console.error('Invalid timeStamp:', timeStamp);
        return null;
    }

    let date = new Date(timeStamp.timeStamp);

    if (isNaN(date.getTime())) {
        console.error('Invalid date:', date);
        return null;
    }

    let day = days[date.getDay()];
    let dayOfMonth = date.getDate();
    let monthName = month[date.getMonth()];

    return `${day}, ${dayOfMonth} ${monthName}`;
};

function CommentCard({ data, key }) {
    const { commentsWrapper, setCommentWrapper, totalParentsCommentsLoaded, setTotalParentsCommentsLoaded, blog, blog_id, setBlog, comments } = useContext(BlogContext);
    const { comment, commented_by, commentedAt, _id } = data;
    const { user } = useContext(UserContext);
    const fullName = commented_by?.name || "Unknown User";
    const userName = commented_by?.email || "Unknown Username";

    // Use the avatar if it's available, otherwise fall back to a default or initials
    const avatar = commented_by?.avatar || '';
    const [isReplying, setIsReplying] = useState(false);
    const formattedDate = GetDay({ timeStamp: commentedAt });

    const handleClick = () => {
        if (!user) {
            return toast.error("Please Signup to reply");
        }
        setIsReplying(prevVal => !prevVal);
    };

    // If no avatar, create a default avatar (first letter of the name or a default placeholder)
    const renderAvatar = avatar ? (
        <img src={`${avatar}`} alt="User Avatar" className="w-12 h-12 rounded-full object-cover" />
    ) : (
        <div className="w-12 h-12 flex items-center justify-center bg-gray-300 text-white rounded-full text-lg">
            {fullName[0]} {/* Use the first letter of the user's full name as a placeholder */}
        </div>
    );

    return (
        <div className="comment-card my-6 p-6 bg-gradient-to-r from-gray-50 to-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
            <div className="flex flex-wrap items-center mb-4">
                {renderAvatar} {/* Render the avatar or placeholder */}
                <div className="ml-4">
                    <h4 className="font-semibold  text-indigo-600">{fullName}</h4>
                    <p className=" text-gray-500 text-xs ">@{userName}</p>
                    <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
                </div>
            </div>

            <p className="text-gray-800 text-lg">{comment || "No comment text available"}</p>

            <div onClick={handleClick} className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
                Reply
            </div>

            {/* {isReplying && (
                <div className="mt-3">
                    <CommentFeild index={key} replyingTo={_id} setReplying={setIsReplying} />
                </div>
            )} */}
        </div>
    );
}

export default CommentCard;
