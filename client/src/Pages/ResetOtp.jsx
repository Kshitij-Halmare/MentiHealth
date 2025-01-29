import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function ResetOtp() {
  const userID=useParams();
  const [otp, setOtp] = useState('');  // State to store OTP input value
  const [error, setError] = useState('');  // To store error message (if any)
  const navigate=useNavigate();
  // Handle OTP input change
  const handleInputChange = (e) => {
    setOtp(e.target.value);
    setError(''); // Reset error on change
  };

  // Handle form submission (verification logic)
  const handleSubmit =async (e) => {
    e.preventDefault();
    
    // Add logic to verify OTP here
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    const response=await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/checkOtp`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({userID,otp})
    });
    const resData=await response.json();
    if(resData.success){
      navigate(`/changePassword/${userID.userId}`);
    }else{
      toast(resData.message);
    }
    console.log("OTP submitted:", otp);
  };

  return (
    <div className="bg-gradient-to-b from-purple-100 via-white to-purple-200  md:min-h-screen md:p-12 min-h-[600px]">
      <div className="bg-white w-96 rounded-md shadow-lg p-6">
        <h1 className="text-xl font-semibold mb-4">Enter Your OTP</h1>
        
        {/* OTP Input */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={handleInputChange}
            placeholder="Enter your OTP"
            maxLength="6" // Ensure only 6 digits can be entered
            className="p-2 text-center font-semibold font-serif bg-slate-200 placeholder:text-slate-600 rounded-md outline-none hover:shadow-md duration-200 w-full mb-4"
          />
          
          {/* Error message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-2 bg-slate-500 hover:bg-slate-600 text-white rounded-md mt-4 transition duration-200"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetOtp;
