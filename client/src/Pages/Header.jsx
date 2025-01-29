import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../assets/image_processing20191110-30800-mr2oo2.gif";
import { UserContext } from "../Context/UserProvider";

function Header() {
  const { Logout } = useContext(UserContext);
  const [checkbox, setCheckbox] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="shadow-md flex justify-between h-20 sticky top-0 bg-white z-50 md:px-10 px-4">
      {/* Logo Section */}
      <div className="flex items-center">
        <h1 className="md:text-4xl text-2xl font-serif font-bold cursor-pointer " onClick={() => navigate("/")}>OPEN HEART</h1>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center">
        <ul className="flex space-x-6 text-lg  font-sans items-center">
          <li
            onClick={() => navigate("/talk")}
            className="hover:underline hover:underline-offset-3 md:block hidden cursor-pointer"
          >
            Start Conversation
          </li>
          <li
            onClick={() => navigate("/about")}
            className="hover:underline hover:underline-offset-3 cursor-pointer md:block hidden"
          >
            About
          </li>
          <li
            onClick={() => navigate("/working")}
            className="hover:underline hover:underline-offset-3 cursor-pointer md:block hidden"
          >
            How it Works
          </li>
          <li
            onClick={() => navigate("/registerCounsellor")}
            className="hover:underline hover:underline-offset-3 cursor-pointer md:block hidden"
          >
            Register As Counsellor
          </li>
          <li
            onClick={() => navigate("/getCounsellor")}
            className="hover:underline hover:underline-offset-3 cursor-pointer md:block hidden"
          >
            Counsellors
          </li>
          <li
            onClick={() => navigate("/community")}
            className="hover:underline hover:underline-offset-3 cursor-pointer md:block hidden"
          >
            Community
          </li>
        </ul>

        {/* Profile Image and Dropdown */}
        <div className="relative ml-6">
          <div
            className="h-12 w-12 cursor-pointer border-2 rounded-full overflow-hidden"
            onClick={() => setCheckbox(!checkbox)}
          >
            <img src={image} alt="Profile" className="h-full w-full" />
          </div>

          {/* Dropdown Menu */}
          {checkbox && (
            <div className="absolute bg-white shadow-lg  right-0 mt-2 py-2 w-48 rounded-lg border">
              <ul className="flex flex-col text-lg font-sans ">
              <li
                onClick={() => navigate("/editor")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Create An Blog
              </li>
              <li
                onClick={() => navigate("/register")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Register
              </li>
              <li
                onClick={() => navigate("/registerCounsellor")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Register Counsellor
              </li>
              <li
                onClick={() => navigate("/login")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Login
              </li>
              <li
                onClick={() => navigate("/profile")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Profile
              </li>
              <li
                onClick={() => navigate("/loginCounsellor")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Login As Counsellor
              </li>
              <li
                onClick={() => { Logout(); }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
              >
                Delete
              </li>
              <li
                onClick={() => navigate("/talk")}
                className="px-4 py-2 md:hidden block cursor-pointer"
              >
                Start Conversation
              </li>
              <li
                onClick={() => navigate("/about")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer md:hidden block"
              >
                About
              </li>
              <li
                onClick={() => navigate("/working")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer md:hidden block"
              >
                How it Works
              </li>
              <li
                onClick={() => navigate("/contact")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer md:hidden block"
              >
                Contact
              </li>
              <li
                onClick={() => navigate("/getCounsellor")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer md:hidden block"
              >
                Counsellors
              </li>
              <li
                onClick={() => navigate("/community")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer md:hidden block"
              >
                Community
              </li>

            </ul>
            </div>
          )}
      </div>
    </div>
    </div >
  );
}

export default Header;



