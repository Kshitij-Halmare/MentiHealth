import React from 'react';
import Header from './Pages/Header';
import Footer from './Pages/Footer';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <Header />
      <main className="min-h-[56vh] ">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
