import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast"
function VerifyEmail() {
    const navigate=useNavigate();
    const { userId } = useParams();
    console.log(userId);
    const handleSubmit=async()=>{
        const response=await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/verify-email`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({userId})
        })
        const resData=await response.json();
        if(resData.success){
            toast("Email Verified SuccessFully Please Login");
            navigate("/login");
        }else{
            navigate("/register")
        }
    }
    return (
        <div className='w-full h-screen bg-pink-50 flex  justify-center'>
            <div className=" h-96 md:p-10 p-4 rounded-2xl hover:rounded-none shadow-md text-center hover:shadow-lg hover:bg-gray-50 mt-10 bg-white">
                <h1 className="md:text-2xl font-semibold font-serif md:mb-20 mb-10 underline underline-offset-4 ">Please Verify Your Email</h1>
            <button onClick={handleSubmit} className='bg-slate-800 text-red-50 px-4 py-2 rounded-lg hover:opacity-80 hover:px-6 hover:py-3 duration-200'>
                Verify Your Email
            </button>
            </div>
        </div>
    );
}

export default VerifyEmail;
