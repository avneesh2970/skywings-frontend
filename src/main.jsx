import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import About from "./about";
import Contact from "./Contact";
import Job from "./componentes/job";
import JobDtails from "./componentes/job-details";
import Services from "./componentes/services";
import Blog from "./componentes/blog";
import Employes from "./componentes/employe";
import Career from "./componentes/carrer";
import Fresher from "./componentes/fresher";
import DetailService from "./componentes/DetailService";
import Nws from "./componentes/news/Nws";
import Upload from "./componentes/Upload";
import Faq from "./componentes/Faq";
import PrivacyPolicy from "./componentes/PrivacyPolicy";
import ArticleDetails from "./componentes/blog/blogdetails";
import Disclaimer from "./componentes/Disclaimer";
import AdminDashboard from "./componentes/Admin/AdminDashboard";
import { AppProvider } from "./context/AppContext";
import HomePage from "./componentes/Admin/blogs/HomePage";
import BlogPost from "./componentes/Admin/blogs/BlogPost";
import Editor from "./componentes/Admin/blogs/Editor";
import Events from "./componentes/Admin/blogs/Events";
import AddEvents from "./componentes/Admin/blogs/AddEvents";
import BlogsPage from "./componentes/Admin/blogs/BlogsPage";
import ContactUs from "./componentes/Admin/ContactUs";
import Resumes from "./componentes/Admin/Resumes";
import NewsLetter from "./componentes/Admin/NewsLetter";
import Settings from "./componentes/Admin/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/job", element: <Job /> },
      { path: "/jobdetails/:id", element: <JobDtails /> },
      { path: "/services", element: <Services /> },
      { path: "/blog", element: <Blog /> },
      { path: "/news", element: <Nws /> },
      { path: "/employes", element: <Employes /> },
      { path: "/carrers", element: <Career /> },
      { path: "/fresher", element: <Fresher /> },
      { path: "/DetailService/:id", element: <DetailService /> },
      { path: "/upload", element: <Upload /> },
      { path: "/faq", element: <Faq /> },
      { path: "/policy", element: <PrivacyPolicy /> },
      { path: "/article/:id", element: <ArticleDetails /> },
      { path: "/disclaimer", element: <Disclaimer /> },
    ],
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    children: [
      {
        path: "/admin/dashboard",
        element: <HomePage />,
      },
      {
        path: "/admin/dashboard/blogs",
        element: <BlogsPage />,
      },
      {
        path: "/admin/dashboard/blog-post/:id",
        element: <BlogPost />,
      },
      {
        path: "/admin/dashboard/blog-post/editor",
        element: <Editor />,
      },
      {
        path: "/admin/dashboard/blog-post/editor/:id",
        element: <Editor />,
      },
      {
        path: "/admin/dashboard/events",
        element: <Events />,
      },
      {
        path: "/admin/dashboard/events/new",
        element: <AddEvents />,
      },
      {
        path: "/admin/dashboard/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/admin/dashboard/resumes",
        element: <Resumes />,
      },
      {
        path: "/admin/dashboard/newsletter",
        element: <NewsLetter />,
      },
      {
        path: "/admin/dashboard/settings",
        element: <Settings />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>
);
