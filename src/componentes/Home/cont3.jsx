import { list } from "../../data";
import { useNavigate } from "react-router-dom";
function Cont3() {
  const navigate = useNavigate();
  const handleClick = (service) => {
    navigate(`/DetailService/${service.id}`);
    window.scrollTo(0, 0);
  };
  // const services = [
  //   { title: "Permanent Staffing", image: img1 },
  //   { title: "Temporary Staffing", image: img2},
  //   { title: "Contract c", image: img3},
  //   { title: "Executive Search", image: img4 },
  //   { title: "Recruitment Process Outsourcing (RPO)", image: img5},
  //   { title: "Skill Gap Assessment", image: img6},
  //   { title: "Internship Program Management", image: img7},
  //   { title: "Campus Recruitment Drives", image: img8},
  //   { title: "Graduate Trainee Programs", image: img9},
  //   { title: "Diversity & Inclusion Hiring Initiatives", image: img10 },
  //   { title: "Onboarding and Training Support", image: img11 },
  //   { title: "Pre-Placement Offer (PPO) Recruitment", image: img12 },
  // ];

  return (
    <div className="flex flex-col items-center p-6 bg-[#F5F5F5] min-h-screen">
      <span className="bg-purple-200 text-purple-700 text-xs font-semibold px-3 py-1 my-2 rounded-full">
        SERVICES
      </span>
      <p className="text-purple-700 mb-8 text-center ">
        Our complete assistance will be with you, and we guide you accordingly.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-8   w-full  ">
      
       
        {list.slice(0, 8).map((service, index) => (
          <div
            key={index}
            onClick={() => handleClick(service)} // ✅ Passing service explicitly
            className="bg-[#F5F5F5] rounded-xl overflow-hidden cursor-pointer"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-40 object-cover"
            />
            <div className="py-4">
              <h3 className="text-base font-semibold">{service.title}</h3>
              <a
                href="#"
                className="text-blue-500 text-sm font-medium mt-2 inline-flex items-center"
              >
                View Details →
              </a>
            </div>
          </div>
        ))}
      
      <div className="flex justify-center items-center">
 
</div>

    </div>
    <button
    onClick={() => {
      navigate("/services");
      window.scrollTo(0, 0); // Scroll to top
    }}
    className="text-blue-500 px-14 rounded-full hover:bg-blue-500 hover:text-white font-semibold py-2 border border-blue-500"
  >
    See more
  </button>
    </div>
  );
}
export default Cont3;
