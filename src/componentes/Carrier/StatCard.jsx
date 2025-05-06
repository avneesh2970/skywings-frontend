"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const StatCard = ({ count, platform }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // Parse the count value
  const parseCount = () => {
    if (count.includes("K")) {
      return Number.parseFloat(count.replace("K", "")) * 1000;
    }
    return Number.parseFloat(count.replace(/,/g, ""));
  };

  // Format the count value
  const formatCount = (value) => {
    if (count.includes("K")) {
      return `${(value / 1000).toFixed(1).replace(".0", "")}K`;
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const finalValue = parseCount();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Get platform icon and color
  const getPlatformDetails = () => {
    switch (platform.toLowerCase()) {
      case "instagram followers":
        return {
          icon: (
            <FaInstagram className="text-2xl transition-transform duration-500 ease-out" />
          ),
          color: "from-purple-500 to-pink-500",
          hoverColor: "from-purple-600 to-pink-600",
        };
      case "facebook followers":
        return {
          icon: (
            <FaFacebookF className="text-2xl transition-transform duration-500 ease-out" />
          ),
          color: "from-blue-500 to-blue-600",
          hoverColor: "from-blue-600 to-blue-700",
        };
      case "linkedin followers":
        return {
          icon: (
            <FaLinkedinIn className="text-2xl transition-transform duration-500 ease-out" />
          ),
          color: "from-blue-600 to-cyan-600",
          hoverColor: "from-blue-700 to-cyan-700",
        };
      case "youtube subscribers":
        return {
          icon: (
            <FaYoutube className="text-2xl transition-transform duration-500 ease-out" />
          ),
          color: "from-red-500 to-red-600",
          hoverColor: "from-red-600 to-red-700",
        };
      default:
        return {
          icon: null,
          color: "from-gray-500 to-gray-600",
          hoverColor: "from-gray-600 to-gray-700",
        };
    }
  };

  const { icon, color, hoverColor } = getPlatformDetails();

  return (
    <div
      ref={cardRef}
      className="w-full max-w-xs"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative overflow-hidden rounded-xl p-6 h-40
          bg-gradient-to-br ${isHovered ? hoverColor : color}
          transform transition-all duration-500 ease-out
          ${isHovered ? "scale-105 shadow-lg" : "shadow-md"}
        `}
      >
        {/* Animated background circles */}
        <div
          className={`
          absolute top-0 left-0 w-32 h-32 rounded-full bg-white opacity-10
          transition-all duration-700 ease-out
          ${isHovered ? "scale-150 -translate-y-4 -translate-x-4" : "scale-100"}
        `}
        ></div>

        <div
          className={`
          absolute bottom-0 right-0 w-24 h-24 rounded-full bg-white opacity-10
          transition-all duration-700 ease-out
          ${isHovered ? "scale-150 translate-y-4 translate-x-4" : "scale-100"}
        `}
        ></div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div
            className={`
            transform transition-transform duration-500
            ${isHovered ? "translate-y-0 rotate-0" : "-translate-y-1 rotate-0"}
          `}
          >
            {icon}
          </div>

          <div>
            <CountUp
              end={finalValue}
              format={formatCount}
              isVisible={isVisible}
              duration={2500}
              className="text-3xl md:text-4xl font-bold text-white mb-1"
            />
            <p
              className={`
              text-white text-opacity-90 font-medium text-sm md:text-base
              transform transition-all duration-500
              ${isHovered ? "translate-x-2" : "translate-x-0"}
            `}
            >
              {platform}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// CountUp component for animating numbers
const CountUp = ({ end, format, isVisible, duration = 2000, className }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const frameRef = useRef(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!isVisible) return;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smoother animation
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(percentage);

      const currentCount = Math.floor(easedProgress * end);

      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }

      if (percentage < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [isVisible, end, duration]);

  return <div className={className}>{format(count)}</div>;
};

export default StatCard;
