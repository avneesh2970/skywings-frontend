import img1 from "../../assets/products/image33.png";
import img2 from "../../assets/products/image 35.png";
import img3 from "../../assets/products/image36.png";
import img4 from "../../assets/products/image 37.png";

const Cont11 = () => {
  const seminars = [
    { title: "Permanent Staffing", image: img1 },
    { title: "Temporary Staffing", image: img2 },
    { title: "Contract Staffing", image: img3 },
    { title: "Executive Search", image: img4 },
  ];
  const Webinar = [
    { title: "Permanent Staffing", image: img1 },
    { title: "Temporary Staffing", image: img2 },
    { title: "Contract Staffing", image: img3 },
    { title: "Executive Search", image: img4 },
  ];
  return (
    <>
    {/* -------------------------------UPCOMING SEMINARS-------------------- */}
      <div className="flex flex-col items-center p-6 bg-[#F5F5F5] min-h-screen ">
        <span className="bg-purple-200 text-purple-600 text-xs font-semibold px-3 py-1 my-2 rounded-full">
          WEBINAR & EVENTS
        </span>
        <p className="text-purple-700 mb-8 text-center max-w-2xl">
          Our complete assistance will be with you, and we guide you
          accordingly.
        </p>
        <h2 className="text-2xl self-start lg:mx-20 mb-5 font-semibold">
          Upcoming Seminars
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {seminars.map((service, index) => (
            <div key={index} className="bg-[#F5F5F5] overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full "
              />
              <div className="p-2">
                <h3 className="text-lg font-semibold">{service.title}</h3>
              </div>
            </div>
          ))}
        </div>
      {/* ----------------------------------Webinar Recordings--------------- */}
      <h2 className="text-2xl self-start mt-10 lg:mx-20 mb-5 font-semibold">
      Webinar Recordings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {Webinar.map((web, index) => (
            <div key={index} className="bg-[#F5F5F5] overflow-hidden">
              <img
                src={web.image}
                alt={web.title}
                className="w-full "
              />
              <div className="p-2">
                <h3 className="text-lg font-semibold">{web.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      
    </>
  );
};
export default Cont11;
