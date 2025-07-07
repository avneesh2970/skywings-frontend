import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./componentes/navbar";
import Footer from "./componentes/footer";
import CookieBanner from "./componentes/CookieBanner";
import SocialmediaConn from "./componentes/SocialmediaConn";
import { Toaster } from "react-hot-toast";
import { initGA, trackPageView } from "./analytics";
import { useEffect } from "react";

function App() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    <>
      <CookieBanner />
      <SocialmediaConn />
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
