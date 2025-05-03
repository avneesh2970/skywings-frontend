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
  "/Brand/logo12.png",
  "/Brand/logo13.png",
  "/Brand/logo14.gif",
  "/Brand/logo15.png",
  "/Brand/logo16.png",
  "/Brand/logo17.png",
  "/Brand/logo18.jpg",
  "/Brand/logo19.png",
  "/Brand/logo20.png",
  "/Brand/logo21.png",
  "/Brand/logo22.png",
  "/Brand/logo23.png",
  "/Brand/logo24.png",
  "/Brand/logo25.jpg",
  "/Brand/logo26.png",
  "/Brand/logo27.gif",
  "/Brand/logo28.png",
  "/Brand/logo29.png",
  "/Brand/logo30.png",
  "/Brand/logo31.png",
  "/Brand/logo32.png",
  "/Brand/logo33.jpg",
  "/Brand/logo34.jpg",
  "/Brand/logo35.jpg",
  "/Brand/logo36.png",
  "/Brand/logo37.png",
]

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

    // Define a constant speed in pixels per second
    const pixelsPerSecond = 50; // Adjust this value to control speed (lower = slower)

    // Calculate pixels per frame based on 60fps
    const pixelsPerFrame = pixelsPerSecond / 60;

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

// "use client";

// import { useEffect, useRef } from "react";

// const images = [
//   "/Brand/logo1.png",
//   "/Brand/logo2.png",
//   "/Brand/logo3.jpg",
//   "/Brand/logo4.png",
//   "/Brand/logo5.png",
//   "/Brand/logo6.jpg",
//   "/Brand/logo7.png",
//   "/Brand/logo8.png",
//   "/Brand/logo9.png",
//   "/Brand/logo10.jpg",
//   "/Brand/logo11.png",
//   "/Brand/logo12.png",
//   "/Brand/logo13.png",
//   "/Brand/logo14.gif",
//   "/Brand/logo15.png",
//   "/Brand/logo16.png",
//   "/Brand/logo17.png",
//   "/Brand/logo18.jpg",
//   "/Brand/logo19.png",
//   "/Brand/logo20.png",
//   "/Brand/logo21.png",
//   "/Brand/logo22.png",
//   "/Brand/logo23.png",
//   "/Brand/logo24.png",
//   "/Brand/logo25.jpg",
//   "/Brand/logo26.png",
//   "/Brand/logo27.gif",
//   "/Brand/logo28.png",
//   "/Brand/logo29.png",
//   "/Brand/logo30.png",
//   "/Brand/logo31.png",
//   "/Brand/logo32.png",
//   "/Brand/logo33.jpg",
//   "/Brand/logo34.jpg",
//   "/Brand/logo35.jpg",
//   "/Brand/logo36.png",
//   "/Brand/logo37.png",
// ];

// const Cont6A = () => {
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     const scrollContainer = scrollRef.current;
//     if (!scrollContainer) return;

//     // Clone enough items to ensure smooth scrolling
//     const itemCount = scrollContainer.children.length;
//     const itemWidth = scrollContainer.children[0].offsetWidth + 12; // width + margin (space-x-3)

//     // Clone items for seamless scrolling
//     const cloneItems = () => {
//       const items = Array.from(scrollContainer.children);
//       items.forEach((item) => {
//         const clone = item.cloneNode(true);
//         scrollContainer.appendChild(clone);
//       });
//     };

//     // Clone items initially
//     cloneItems();

//     let scrollPosition = 0;

//     // Define a constant speed in pixels per second
//     const pixelsPerSecond = 50; // Adjust this value to control speed (lower = slower)

//     // Calculate pixels per frame based on 60fps
//     const pixelsPerFrame = pixelsPerSecond / 60;

//     const scroll = () => {
//       scrollPosition -= pixelsPerFrame;

//       // When we've scrolled past an item, move it to the end
//       if (Math.abs(scrollPosition) >= itemWidth) {
//         scrollPosition += itemWidth;
//         const firstItem = scrollContainer.firstElementChild;
//         scrollContainer.appendChild(firstItem);
//       }

//       scrollContainer.style.transform = `translateX(${scrollPosition}px)`;
//       requestAnimationFrame(scroll);
//     };

//     const animationId = requestAnimationFrame(scroll);

//     return () => {
//       cancelAnimationFrame(animationId);
//     };
//   }, []);

//   return (
//     <div className="flex flex-col">
//       <section className="py-10 bg-white text-center">
//         {/* Heading */}
//         <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-800 mb-8">
//           Top Partnership
//         </h2>

//         {/* Infinite Scrolling Wrapper */}
//         <div className="overflow-hidden w-full">
//           <div
//             ref={scrollRef}
//             className="flex space-x-3"
//             style={{ willChange: "transform" }}
//           >
//             {images.map((img, index) => (
//               <>
//                 <img
//                   src="/Brand/logo29.png"
//                   className="bg-gray-100 h-20 object-contain"
//                 />
//               </>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Cont6A;
