import { createRoot } from 'react-dom/client';
import router from './Routes/index.jsx';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import "./index.css";
import UserProvider from './Context/UserProvider.jsx';

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <RouterProvider router={router} />
    <Toaster />
  </UserProvider>
);
