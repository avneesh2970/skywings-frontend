// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import "./App.css";
// import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import App from "./App";
// import Home from "./Home";
// import About from "./about";
// import Contact from "./Contact";
// import Job from "./componentes/job";
// import JobDtails from "./componentes/job-details";
// import Services from "./componentes/services";
// import Blog from "./componentes/blog";
// import Employes from "./componentes/employe";
// import Career from "./componentes/carrer";
// import Fresher from "./componentes/fresher";
// import DetailService from "./componentes/DetailService";
// import Nws from "./componentes/news/Nws";
// import Upload from "./componentes/Upload";
// import Faq from "./componentes/Faq";
// import PrivacyPolicy from "./componentes/PrivacyPolicy";
// import ArticleDetails from "./componentes/blog/blogdetails";
// import Disclaimer from "./componentes/Disclaimer";
// import AdminDashboard from "./componentes/Admin/AdminDashboard";
// import { AppProvider } from "./context/AppContext";
// import HomePage from "./componentes/Admin/blogs/HomePage";
// import BlogPost from "./componentes/Admin/blogs/BlogPost";
// import Editor from "./componentes/Admin/blogs/Editor";
// import Events from "./componentes/Admin/blogs/Events";
// import AddEvents from "./componentes/Admin/blogs/AddEvents";
// import BlogsPage from "./componentes/Admin/blogs/BlogsPage";
// import ContactUs from "./componentes/Admin/ContactUs";
// import Resumes from "./componentes/Admin/Resumes";
// import NewsLetter from "./componentes/Admin/NewsLetter";
// import Settings from "./componentes/Admin/Settings";
// import Event from "./componentes/events/Event";
// import NewsDetail from "./componentes/news/NewsDetails";
// import AdminLogin from "./componentes/Admin/adminLogin/AdminLogin";
// import AdminProtectedRoute from "./componentes/protectedRoute/AdminProtectedRoute";
// import NewsListPage from "./componentes/Admin/news/NewsListPage";
// import CreateNewsPage from "./componentes/Admin/news/CreateNewsPage";
// import EditNewsPage from "./componentes/Admin/news/EditNewsPage";
// import SecuritySettings from "./componentes/Admin/SecuritySettings";
// import { Toaster } from "react-hot-toast";
// import GalleryPage from "./componentes/gallary/GalleryPage";
// import GalleryDashboard from "./componentes/Admin/gallery/GalleryDashboard";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <AppProvider>
//         <App />
//       </AppProvider>
//     ),
//     children: [
//       { path: "/", element: <Home /> },
//       { path: "/about", element: <About /> },
//       { path: "/contact", element: <Contact /> },
//       { path: "/job", element: <Job /> },
//       { path: "/jobdetails/:id", element: <JobDtails /> },
//       { path: "/services", element: <Services /> },
//       { path: "/blog", element: <Blog /> },
//       { path: "/events", element: <Event /> },
//       { path: "/news", element: <Nws /> },
//       { path: "/news/:id", element: <NewsDetail /> },
//       { path: "/employes", element: <Employes /> },
//       { path: "/carrers", element: <Career /> },
//       { path: "/fresher", element: <Fresher /> },
//       { path: "/DetailService/:id", element: <DetailService /> },
//       { path: "/upload", element: <Upload /> },
//       { path: "/faq", element: <Faq /> },
//       { path: "/policy", element: <PrivacyPolicy /> },
//       { path: "/article/:id", element: <ArticleDetails /> },
//       { path: "/disclaimer", element: <Disclaimer /> },
//       { path: "/gallery", element: <GalleryPage /> },
//     ],
//   },
//   {
//     path: "/admin/dashboard",
//     element: (
//       <AppProvider>
//         <AdminProtectedRoute>
//           <AdminDashboard />
//         </AdminProtectedRoute>
//       </AppProvider>
//     ),
//     children: [
//       {
//         path: "/admin/dashboard",
//         element: <HomePage />,
//       },
//       {
//         path: "/admin/dashboard/blogs",
//         element: <BlogsPage />,
//       },
//       {
//         path: "/admin/dashboard/blog-post/:id",
//         element: <BlogPost />,
//       },
//       {
//         path: "/admin/dashboard/blog-post/editor",
//         element: <Editor />,
//       },
//       {
//         path: "/admin/dashboard/blog-post/editor/:id",
//         element: <Editor />,
//       },
//       {
//         path: "/admin/dashboard/events",
//         element: <Events />,
//       },
//       {
//         path: "/admin/dashboard/gallery",
//         element: <GalleryDashboard />,
//       },
//       {
//         path: "/admin/dashboard/events/new",
//         element: <AddEvents />,
//       },
//       {
//         path: "/admin/dashboard/news",
//         element: <NewsListPage />,
//       },
//       {
//         path: "/admin/dashboard/news/create",
//         element: <CreateNewsPage />,
//       },
//       {
//         path: "/admin/dashboard/news/edit/:id",
//         element: <EditNewsPage />,
//       },
//       {
//         path: "/admin/dashboard/contact-us",
//         element: <ContactUs />,
//       },
//       {
//         path: "/admin/dashboard/resumes",
//         element: <Resumes />,
//       },
//       {
//         path: "/admin/dashboard/newsletter",
//         element: <NewsLetter />,
//       },
//       {
//         path: "/admin/dashboard/settings",
//         element: <Settings />,
//       },
//       {
//         path: "/admin/dashboard/settings/security",
//         element: <SecuritySettings />,
//       },
//     ],
//   },
//   {
//     path: "/admin/login",
//     element: (
//       <AppProvider>
//         <AdminLogin />
//       </AppProvider>
//     ),
//   },
// ]);

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <RouterProvider router={router} />
//   </StrictMode>
// );
