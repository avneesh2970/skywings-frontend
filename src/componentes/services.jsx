import { list } from '../data.jsx'
import Cont5 from './Home/cont5'
import { useNavigate } from 'react-router-dom';
function Services() {
 
    const navigate = useNavigate();
      const handleClick = (service) => {
        navigate(`/DetailService/${service.id}`);
        window.scrollTo(0, 0);
      };
   
  
    return (
      <>
      <div className="flex flex-col items-center p-6 bg-[#F5F5F5] min-h-screen">
        <span className="bg-purple-200 text-purple-700 text-xs font-semibold px-3 py-1 my-2 rounded-full">
        SERVICES
      </span>
        <p className="text-purple-700 mb-8 text-center">
          Our complete assistance will be with you, and we guide you accordingly.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-4 w-full lg:w-auto ">
          {list.map((service, index) => (
            <div key={index} 
            onClick={() => handleClick(service)}
            className="bg-[#F5F5F5]  overflow-hidden">
              <img src={service.image} alt={service.title} className="w-full h-40 object-cover" />
              <div className="">
                <h3 className="text-base font-semibold">{service.title}</h3>
                <a href="#" onClick={() => navigate(`/DetailService/${service.id}`)} className="text-blue-500 text-sm font-medium mt-2 inline-flex items-center">
                  View Details →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Cont5/>
      </>
    );
  }
export default Services;