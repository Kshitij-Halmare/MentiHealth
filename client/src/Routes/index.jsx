import React from "react";
import { createBrowserRouter } from "react-router-dom";
import CommunityHome from "../Editor/CommunityHome.jsx";
import App from "../App";
import Home from "../Pages/Home";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import RegisterCounsellor from "../Pages/RegisterCounsellor";
import Talk from "../Pages/Talk";
import VerifyEmail from "../Pages/VerifyEmail";
import ForgetPassword from "../Pages/ForgetPassword";
import ResetOtp from "../Pages/ResetOtp"; // Correct the file name casing if needed
import ChangePassword from "../Pages/ChangePassword";
import Counsellors from "../Pages/Counsellors";
import SpecificCounsellor from "../Pages/SpecificCounsellor.jsx"; // Fixed extra period
import AvailableSlots from "../Pages/AvailableSlots";
import TermsAndConditions from "../Pages/TermsAndCondition";
import LoginAsCounsellor from "../Pages/LoginAsCounsellor";
import Profile from "../Pages/Profile";
import EditorPage from "../Editor/EditorPage";
import BlogId from "../Editor/BlogId";
import About from "../Pages/About";
import HowItWorks from "../Pages/HowItWorks";
import SuccessPage from "../Pages/SuccessPage.jsx";
import CancelPage from "../Pages/CancelPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/registerCounsellor",
        element: <RegisterCounsellor />,
      },
      {
        path: "/talk",
        element: <Talk />,
      },
      {
        path: "/verify-email/:userId",
        element: <VerifyEmail />,
      },
      {
        path: "/forgetPassword",
        element: <ForgetPassword />,
      },
      {
        path: "/resetOtp/:userId",
        element: <ResetOtp />,
      },
      {
        path: "/changePassword/:userId",
        element: <ChangePassword />,
      },
      {
        path: "/getCounsellor",
        element: <Counsellors />,
      },
      {
        path: "/specificCounsellor/:id",
        element: <SpecificCounsellor />, // Correct the file path
      },
      {
        path: "/availableSlots/:id",
        element: <AvailableSlots />,
      },
      {
        path: "/terms",
        element: <TermsAndConditions />,
      },
      {
        path: "/loginCounsellor",
        element: <LoginAsCounsellor />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/working",
        element: <HowItWorks />,
      },
      {
        path: "/community",
        element: <CommunityHome />,
      },
      {
        path: "/success",
        element: <SuccessPage />,
      },
      {
        path: "/cancel",
        element: <CancelPage />,
      },
    ],
  },
  {
    path: "/editor",
    element: <EditorPage />,
  },
  {
    path: "editBlog/:blog_id",
    element: <EditorPage />,
  },
  {
    path: "/blog/:id",
    element: <BlogId />,
  },
]);

export default router;
