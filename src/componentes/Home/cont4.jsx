
import img from "../../assets/products/Vector (4).png";
import img1 from "../../assets/products/Vector2.png";
import img2 from "../../assets/products/Vector (3).png";
import img5 from "../../assets/products/Vector (5).png";
import img6 from "../../assets/products/Vector (6).png";
import img7 from "../../assets/products/Vector (7).png";
import img8 from "../../assets/products/Vector (8).png";
import img9 from "../../assets/products/Vector (9).png";
import img10 from "../../assets/products/Vector (10).png";
import img11 from "../../assets/products/Vector (11).png";
import img12 from "../../assets/products/Vector (12).png";
import img13 from "../../assets/products/Frame.png";
import img14 from "../../assets/products/Vector (14).png";
import img15 from "../../assets/products/Vector (15).png";
import img16 from "../../assets/products/Vector (16).png";
import img17 from "../../assets/products/Frame1.png";
import Cont6A from "./cont6-A";
import Cont1A from "./cont1-A";

import { motion } from "framer-motion";

export default function Cont4() {
  const industries = [
    { name: "Edtech", icon: img },
    { name: "Sales & Marketing", icon: img1 },
    { name: "Engineering", icon: img2 },
    { name: "Health care", icon: img5 },
    { name: "IT & ITES", icon: img6 },
    { name: "Manufacturing", icon: img7 },
    { name: "Telecom/ISP", icon: img8 },
    { name: "FMCG", icon: img8 },
    { name: "Fintech", icon: img9 },
    { name: "BFSI/NBFC", icon: img10 },
    { name: "Export/Import", icon: img11 },
    { name: "Travel and Tourism", icon: img12 },
    { name: "BPO/KPO/Shared Services", icon: img13 },
    { name: "Medical/Pharmaceuticals", icon: img14 },
    { name: "Educational/Training", icon: img17 },
    { name: "Automobile", icon: img16 },
    { name: "Retail", icon: img },
    { name: "Construction", icon: img15 },
    { name: "E-Commerce", icon: img15 },
  ];

  return (
    <>
      <div className="bg-purple-50 py-10 text-center">
        <span className="bg-purple-200 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
          INDUSTRIES
        </span>
        <h2 className="text-lg text-purple-600 mt-4">
          Our complete assistance will be with you and we guide you accordingly.
        </h2>
        <div className="w-full max-w-7xl mx-auto px-10 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: false }}
                className="flex items-center gap-2 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 cursor-pointer p-2"
                style={{
                  transition: "background-color 0.2s ease",
                }}
              >
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  <img
                    src={industry.icon || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium overflow-hidden text-ellipsis">
                  {industry.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* -------------------------------Top Partnership---------------------------- */}
      <Cont6A></Cont6A>
      <Cont1A></Cont1A>
    </>
  );
}
