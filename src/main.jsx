import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import{ RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './Home'
import About from './about'
import Contact from './Contact'
import Job from './componentes/job'
import JobDtails from './componentes/job-details'
import Services from './componentes/services'
import Blog from './componentes/blog'
import Employes from './componentes/employe'
import Career from './componentes/carrer'
import Fresher from './componentes/fresher'
import DetailService from './componentes/DetailService'
import Nws from './componentes/news/Nws'
import Upload from './componentes/Upload'
import Faq from './componentes/Faq'
import PrivacyPolicy from './componentes/PrivacyPolicy'
import ArticleDetails from './componentes/blog/blogdetails'
import Disclaimer from './componentes/Disclaimer';



const router = createBrowserRouter([
  {path:'/', 
  element: <App/>,
  children:[
    {path:'/',element :<Home/> },
    {path:'/about', element: <About/>},
    {path:'/contact', element: <Contact/>},
    {path:'/job', element: <Job/>},
    {path:'/jobdetails/:id', element:<JobDtails/>},
    {path:'/services', element: <Services/>},
    {path :'/blog', element: <Blog/>},
    {path :'/news', element: <Nws/>},
    {path:'/employes', element:<Employes/>},
    {path: '/carrers', element: <Career/>},
    {path:'/fresher', element: <Fresher/>},
    {path:'/DetailService/:id', element: <DetailService/>},
    {path:'/upload', element: <Upload/>},
    {path:'/faq', element: <Faq/>},
    {path:'/policy', element: <PrivacyPolicy/>},
    {path:"/article/:id", element:<ArticleDetails />} ,
    {path:'/disclaimer', element: <Disclaimer/>},
  ]
}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>,
)