"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import img19 from "../../assets/products/image 19.png";
import { useNavigate } from "react-router-dom";

//logo images imorts
import logo1 from "../../assets/brands/logo1.png";
import logo2 from "../../assets/brands/logo2.png";
import logo3 from "../../assets/brands/logo3.png";
import logo4 from "../../assets/brands/logo4.png";
import logo5 from "../../assets/brands/logo5.png";
import logo6 from "../../assets/brands/logo6.png";
import logo7 from "../../assets/brands/logo7.png";
import logo8 from "../../assets/brands/logo8.png";
import logo9 from "../../assets/brands/logo9.png";
import logo10 from "../../assets/brands/logo10.png";
import logo11 from "../../assets/brands/logo11.png";
import logo12 from "../../assets/brands/logo12.png";
import logo13 from "../../assets/brands/logo13.png";
import logo14 from "../../assets/brands/logo14.png";
import logo15 from "../../assets/brands/logo15.png";
import logo16 from "../../assets/brands/logo16.png";
import logo17 from "../../assets/brands/logo17.png";
import logo18 from "../../assets/brands/logo18.png";
import logo19 from "../../assets/brands/logo19.png";
import logo20 from "../../assets/brands/logo20.png";
import logo21 from "../../assets/brands/logo21.png";
import logo22 from "../../assets/brands/logo22.png";
import logo23 from "../../assets/brands/logo23.png";
import logo24 from "../../assets/brands/logo24.png";
import logo25 from "../../assets/brands/logo25.png";
import logo26 from "../../assets/brands/logo26.png";
import logo27 from "../../assets/brands/logo27.png";
import logo28 from "../../assets/brands/logo28.png";
import logo29 from "../../assets/brands/logo29.png";
import logo30 from "../../assets/brands/logo30.png";
import logo31 from "../../assets/brands/logo31.png";
import logo32 from "../../assets/brands/logo32.png";
import logo33 from "../../assets/brands/logo33.png";
import logo34 from "../../assets/brands/logo34.png";
import logo35 from "../../assets/brands/logo35.png";
import logo36 from "../../assets/brands/logo36.png";
import logo37 from "../../assets/brands/logo37.png";

// const images = [
//   "/Brand/logo1.png",
//   "/Brand/logo2.png",
//   "/Brand/logo3.png",
//   "/Brand/logo4.png",
//   "/Brand/logo5.png",
//   "/Brand/logo6.png",
//   "/Brand/logo7.png",
//   "/Brand/logo8.png",
//   "/Brand/logo9.png",
//   "/Brand/logo10.png",
//   "/Brand/logo11.png",
//   "/Brand/logo12.png",
//   "/Brand/logo13.png",
//   "/Brand/logo14.png",
//   "/Brand/logo15.png",
//   "/Brand/logo16.png",
//   "/Brand/logo17.png",
//   "/Brand/logo18.png",
//   "/Brand/logo19.png",
//   "/Brand/logo20.png",
//   "/Brand/logo21.png",
//   "/Brand/logo22.png",
//   "/Brand/logo23.png",
//   "/Brand/logo24.png",
//   "/Brand/logo25.jpg",
//   "/Brand/logo26.png",
//   "/Brand/logo27.png",
//   "/Brand/logo28.png",
//   "/Brand/logo29.png",
//   "/Brand/logo30.png",
//   "/Brand/logo31.png",
//   "/Brand/logo32.png",
//   "/Brand/logo33.png",
//   "/Brand/logo34.png",
//   "/Brand/logo35.png",
//   "/Brand/logo36.png",
//   "/Brand/logo37.png",
// ];

const Cont6A = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Clone items for seamless scrolling
    const itemCount = scrollContainer.children.length;
    const itemWidth = scrollContainer.children[0].offsetWidth + 12; // width + margin (space-x-3)

    const cloneItems = () => {
      const items = Array.from(scrollContainer.children);
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        scrollContainer.appendChild(clone);
      });
    };

    // Clone items initially to ensure enough items for infinite scroll
    cloneItems();
    cloneItems(); // Clone twice for smooth scrolling

    let scrollPosition = 0;
    const pixelsPerSecond = 50; // Speed in pixels per second
    const pixelsPerFrame = pixelsPerSecond / 60; // Assuming 60fps

    const scroll = () => {
      scrollPosition -= pixelsPerFrame;

      // Reset scroll position when scrolled past an item's width
      if (Math.abs(scrollPosition) >= itemWidth) {
        scrollPosition += itemWidth;
        const firstItem = scrollContainer.firstElementChild;
        scrollContainer.appendChild(firstItem);
      }

      scrollContainer.style.transform = `translateX(${scrollPosition}px)`;
      requestAnimationFrame(scroll);
    };

    const animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <style>{`
.slider-container {
  overflow: hidden;
  width: 100%;
  background: white;
  padding: 20px 0;
  position: relative;
}

/* Create two identical sliders for seamless looping */
.slider {
  display: flex;
  gap: 8px;
  animation: scroll 60s linear infinite; /* Increased from 30s to 60s for slower scrolling */
  width: max-content; /* Allow the slider to size based on content */
}

/* Clone the first set of logos */
.slider-content {
  display: flex;
  gap: 8px;
}

/* Make logos responsive */
.slider img {
  height: 80px;
  object-fit: contain;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .slider img {
    height: 60px;
  }
  .slider {
    animation: scroll 45s linear infinite; /* Slower on mobile */
  }
}

@media (max-width: 480px) {
  .slider img {
    height: 40px;
  }
  .slider {
    animation: scroll 35s linear infinite; /* Slower on small screens */
  }
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50%)); /* Move exactly half the width */
  }
}
          
      `}</style>
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
          {/* ABOUT TAG */}
          <motion.div
            className="text-center mb-6 md:mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-purple-200 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
              ABOUT
            </span>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold mb-4"
              >
                Assured Job started as a simple idea: to make job searching
                stress-free and recruitment faster.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-gray-600 mb-4"
              >
                Skywings Advisors Private Limited, headquartered in New Delhi,
                is a leading force in the placement and recruitment industry.
                Our expertise spans across diverse recruitment disciplines,
                including Legal, Finance, IT, Sales & Marketing, Healthcare,
                Automobile, Training & Education, Industrial & Warehouse,
                Construction, E-Commerce, and more. We are committed to
                understanding your business as deeply as you do—tailoring our
                services to align perfectly with your goals. Building that
                connection is paramount, allowing us to bring both comprehensive
                recruitment knowledge and cutting-edge assessment methods to the
                table.
              </motion.p>
              <div className="flex justify-start">
                <button
                  onClick={() => {
                    navigate("/about");
                  }}
                  className="text-blue-500 px-14 mt-2 rounded-full hover:bg-blue-500 hover:text-white mb-10 font-semibold py-2 border border-blue-500"
                >
                  See more
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center"
            >
              <img
                src={
                  img19 ||
                  "/placeholder.svg?height=400&width=500&query=interview"
                }
                alt="Interview Illustration"
                className="w-full max-w-md rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <section className="py-10 bg-white text-center">
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-800 mb-8">
            Top Partnership
          </h2>

          {/* Infinite Scrolling Wrapper */}
          <div className="slider-container">
            <div className="slider">
              <div className="slider-content">
                <img src={logo1} alt="" />
                <img src={logo2} alt="" />
                <img src={logo3} alt="" />
                <img src={logo4} alt="" />
                <img src={logo5} alt="" />
                <img src={logo6} alt="" />
                <img src={logo7} alt="" />
                <img src={logo8} alt="" />
                <img src={logo9} alt="" />
                <img src={logo10} alt="" />
                <img src={logo11} alt="" />
                <img src={logo12} alt="" />
                <img src={logo13} alt="" />
                <img src={logo14} alt="" />
                <img src={logo15} alt="" />
                <img src={logo16} alt="" />
                <img src={logo17} alt="" />
                <img src={logo18} alt="" />
                <img src={logo19} alt="" />
                <img src={logo20} alt="" />
                <img src={logo21} alt="" />
                <img src={logo22} alt="" />
                <img src={logo23} alt="" />
                <img src={logo24} alt="" />
                <img src={logo25} alt="" />
                <img src={logo26} alt="" />
                <img src={logo27} alt="" />
                <img src={logo28} alt="" />
                <img src={logo29} alt="" />
                <img src={logo30} alt="" />
                <img src={logo31} alt="" />
                <img src={logo32} alt="" />
                <img src={logo33} alt="" />
                <img src={logo34} alt="" />
                <img src={logo35} alt="" />
                <img src={logo36} alt="" />
                <img src={logo37} alt="" />
              </div>
              <div className="slider-content">
                <img src={logo1} alt="" />
                <img src={logo2} alt="" />
                <img src={logo3} alt="" />
                <img src={logo4} alt="" />
                <img src={logo5} alt="" />
                <img src={logo6} alt="" />
                <img src={logo7} alt="" />
                <img src={logo8} alt="" />
                <img src={logo9} alt="" />
                <img src={logo10} alt="" />
                <img src={logo11} alt="" />
                <img src={logo12} alt="" />
                <img src={logo13} alt="" />
                <img src={logo14} alt="" />
                <img src={logo15} alt="" />
                <img src={logo16} alt="" />
                <img src={logo17} alt="" />
                <img src={logo18} alt="" />
                <img src={logo19} alt="" />
                <img src={logo20} alt="" />
                <img src={logo21} alt="" />
                <img src={logo22} alt="" />
                <img src={logo23} alt="" />
                <img src={logo24} alt="" />
                <img src={logo25} alt="" />
                <img src={logo26} alt="" />
                <img src={logo27} alt="" />
                <img src={logo28} alt="" />
                <img src={logo29} alt="" />
                <img src={logo30} alt="" />
                <img src={logo31} alt="" />
                <img src={logo32} alt="" />
                <img src={logo33} alt="" />
                <img src={logo34} alt="" />
                <img src={logo35} alt="" />
                <img src={logo36} alt="" />
                <img src={logo37} alt="" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Cont6A;
