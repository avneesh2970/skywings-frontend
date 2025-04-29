// import { list } from '../data.jsx';
// import Cont5 from './Home/cont5';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';

// // Animation variants
// const containerVariants = {
//   hidden: {},
//   show: {
//     transition: {
//       staggerChildren: 0.15
//     }
//   }
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 40 },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.4, ease: 'easeOut' }
//   }
// };

// function Services() {
//   const navigate = useNavigate();

//   const handleClick = (service) => {
//     navigate(`/DetailService/${service.id}`);
//     window.scrollTo(0, 0);
//   };

//   return (
//     <>
//   <div className="bg-white min-h-screen py-8">
//     <div className="flex flex-col items-center">
//       <span className="bg-purple-200 text-purple-700 text-xs font-semibold px-3 py-1 my-2 rounded-full">
//         SERVICES
//       </span>
//       <p className="text-purple-700 mb-6 text-center px-4">
//         Our complete assistance will be with you, and we guide you accordingly.
//       </p>
//     </div>

//     <motion.div
//   className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-2 md:px-4 w-full max-w-[1300px] mx-auto"
//   variants={containerVariants}
//   initial="hidden"
//   whileInView="show"
//   viewport={{ once: false, amount: 0.1 }}
// >
//   {list.map((service, index) => (
//     <motion.div
//       key={index}
//       variants={cardVariants}
//       onClick={() => handleClick(service)}
//       whileHover={{
//         scale: 1.05,
//         y: -5, // slight float
//         transition: { duration: 0.3, ease: 'easeInOut' },
//       }}
//       className="bg-white rounded-xl p-4 cursor-pointer transition-all duration-300 border border-transparent hover:border-blue-300"
//     >
//       <img
//         src={service.image}
//         alt={service.title}
//         className="w-full h-40 object-cover rounded-md"
//       />
//       <div className="mt-3 space-y-2">
//         <h3 className="text-[15px] font-semibold text-gray-800 leading-snug">
//           {service.title}
//         </h3>
//         <a
//           href="#"
//           onClick={(e) => {
//             e.preventDefault();
//             navigate(`/DetailService/${service.id}`);
//           }}
//           className="text-blue-500 text-sm font-medium inline-flex items-center hover:underline"
//         >
//           View Details →
//         </a>
//       </div>
//     </motion.div>
//   ))}
// </motion.div>

//   </div>

//   <Cont5 />
// </>

//   );
// }

// export default Services;


import { list } from '../data.jsx';
import Cont5 from './Home/cont5';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

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

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 px-4 w-full lg:w-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
        >
          {list.map((service, index) => (
            <motion.div
              key={index}
              onClick={() => handleClick(service)}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.3, ease: 'easeInOut' },
              }}
              className="bg-[#F5F5F5] overflow-hidden cursor-pointer p-2"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-40 object-cover"
              />
              <div>
                <h3 className="text-base font-semibold">{service.title}</h3>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/DetailService/${service.id}`);
                  }}
                  className="text-blue-500 text-sm font-medium mt-2 inline-flex items-center"
                >
                  View Details →
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Cont5 />
    </>
  );
}

export default Services;

