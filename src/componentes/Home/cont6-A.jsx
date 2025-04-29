"use client";

import { useEffect, useRef } from "react";

const images = [
  "/Brand/logo1.png",
  "/Brand/logo2.png",
  "/Brand/logo3.jpg",
  "/Brand/logo4.png",
  "/Brand/logo5.png",
  "/Brand/logo6.jpg",
  "/Brand/logo7.png",
  "/Brand/logo8.png",
  "/Brand/logo9.png",
  "/Brand/logo10.jpg",
  "/Brand/logo11.png",
];

const Cont6A = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Clone enough items to ensure smooth scrolling
    const itemCount = scrollContainer.children.length;
    const itemWidth = scrollContainer.children[0].offsetWidth + 12; // width + margin (space-x-3)

    // Clone items for seamless scrolling
    const cloneItems = () => {
      const items = Array.from(scrollContainer.children);
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        scrollContainer.appendChild(clone);
      });
    };

    // Clone items initially
    cloneItems();

    let scrollPosition = 0;

    // Time in seconds to scroll through one complete set of logos
    const secondsToScrollComplete = 30; // Slow, subtle scrolling

    // Calculate pixels per frame based on desired duration
    const containerWidth = itemWidth * itemCount;
    const pixelsPerFrame = containerWidth / (secondsToScrollComplete * 60); // Assuming 60fps

    const scroll = () => {
      scrollPosition -= pixelsPerFrame;

      // When we've scrolled past an item, move it to the end
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
    <div className="flex flex-col">
      <section className="py-10 bg-white text-center">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-800 mb-8">
          Top Partnership
        </h2>

        {/* Infinite Scrolling Wrapper */}
        <div className="overflow-hidden w-full">
          <div
            ref={scrollRef}
            className="flex space-x-3"
            style={{ willChange: "transform" }}
          >
            {images.map((img, index) => (
              <div
                key={index}
                className="bg-gray-100 p-2 rounded-lg flex justify-center items-center min-h-[70px] lg:min-h-[80px] max-h-[70px] lg:max-h-[100px] min-w-[100px] lg:min-w-[160px]"
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Partner ${index + 1}`}
                  className="bg-gray-100 h-20 w-[200px] object-contain lg:object-fill"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cont6A;
