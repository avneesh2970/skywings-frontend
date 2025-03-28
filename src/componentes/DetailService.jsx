import { list } from '../data'
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
function DetailService() {
    const navigate = useNavigate();
    const {id} = useParams();
    const service = list.find((service) => service.id === Number(id));

    const handleClick = (service) => {
      navigate(`/DetailService/${service.id}`);
      window.scrollTo(0, 0);
    };
    
  return (
   <>
    <button onClick={()=> navigate("/services")} className='text-gray-400 font-semibold flex mx-10 cursor-pointer gap-3 border-gray-400  py-1 rounded-lg'><p className='flex items-center'><FaArrowLeft/></p><p>Back</p></button>
    <div className="flex flex-col md:flex-row w-full mt-4 gap-4 ">
  {/* Left Section - Image */}
  <div className="md:w-1/2 w-full  px-11">
    <img
      className="w-full h-auto object-cover rounded-lg shadow-md"
      src={service.image}
      alt="Service"
    />
  </div>

  {/* Right Section - Text Content */}
  <div className="md:w-1/2 w-full bg-gray-50 flex flex-col justify-center  mr-14 ">
    <h3 className="text-lg md:text-2xl text-center font-semibold mb-2">{service.title}</h3>
    <p className="w-full h-[400px] overflow-auto text-base md:text-lg leading-relaxed rounded-lg    " dangerouslySetInnerHTML={{ __html: service.content }}>
      {/* {service.content} */}
      </p>
      <button onClick={()=>navigate('/contact')} className='flex justify-center mx-auto border hover:bg-blue-500 hover:text-white py-1 border-blue-500 text-blue-500 cursor-pointer px-10 text-xl rounded-lg mt-3.5  w-48'>
      {service.button}
    </button>
  </div>
</div>



    <div className="grid  mt-16 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full px-10 ">
          {list.map((service, index) => (
            <div
            key={index}
            onClick={() => handleClick(service)} // ✅ Passing service explicitly
            className="bg-[#F5F5F5] rounded-sm overflow-hidden cursor-pointer"
          >
            <img src={service.image} alt={service.title} className="w-full h-40 object-cover" />
            <div className="">
              <h3 className="text-base font-semibold">{service.title}</h3>
              <a href="#" className="text-blue-500 text-sm font-medium mt-2 inline-flex items-center">
                View Details →
              </a>
            </div>
          </div>
          ))}
        </div>
   </>
  )
}

export default DetailService
