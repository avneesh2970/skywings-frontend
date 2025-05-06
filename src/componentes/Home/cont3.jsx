import { list } from "../../data";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function Cont3() {
  const navigate = useNavigate();
  const handleClick = (service) => {
    navigate(`/DetailService/${service.id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-[#F5F5F5] min-h-screen">
      <span className="bg-purple-200 text-purple-700 text-xs font-semibold px-3 py-1 my-2 rounded-full">
        SERVICES
      </span>
      <p className="text-purple-700 mb-8 text-center">
        Our complete assistance will be with you, and we guide you accordingly.
      </p>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-8 w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.1 }} // Animation triggers every time in view
      >
        {list.slice(0, 8).map((service, index) => (
          <motion.div
          key={index}
          variants={cardVariants}
          onClick={() => handleClick(service)}
          className="bg-[#F5F5F5] rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out hover:scale-90 hover:shadow-2xl hover:shadow-purple-300"
        >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-base font-semibold">{service.title}</h3>
              <a
                href="#"
                className="text-blue-500 text-sm font-medium mt-2 inline-flex items-center"
              >
                View Details →
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>

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
