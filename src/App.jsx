import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./componentes/navbar";
import Footer from "./componentes/footer";
import CookieBanner from "./componentes/CookieBanner";
import SocialmediaConn from "./componentes/SocialmediaConn";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <CookieBanner />
      <SocialmediaConn />
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster/>
    </>
  );
}

export default App;
