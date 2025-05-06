"use client"

import { useState, useEffect, useRef } from "react"

const Cont1A = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const box = [
    { number: "10,000+", value: 10000, format: (val) => `${val.toLocaleString()}+` },
    { number: "1000+", value: 1000, format: (val) => `${val.toLocaleString()}+` },
    { number: "100+", value: 100, format: (val) => `${val.toLocaleString()}+` },
    {
      number: "1,00,000+",
      value: 100000,
      format: (val) => {
        // Indian number formatting (1,00,000)
        const str = val.toString()
        let result = ""
        let count = 0

        for (let i = str.length - 1; i >= 0; i--) {
          count++
          result = str[i] + result

          if (i !== 0) {
            if (count === 3 && str.length - count > 0) {
              result = "," + result
              count = 0
            } else if (count === 2 && result.length > 4) {
              result = "," + result
              count = 0
            }
          }
        }

        return `${result}+`
      },
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }, // Trigger when at least 10% of the element is visible
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {box.map((item, index) => {
            // Alternate between purple and blue gradients
            const gradientClass = index % 2 === 0 
              ? "from-purple-600 to-blue-600" 
              : "from-blue-600 to-purple-600";
              
            return (
              <div
                key={index}
                className="text-center px-3 py-6 sm:py-8 bg-white shadow-md rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative"
              >
                {/* Top gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass}`}></div>
                
                <CountUp
                  end={item.value}
                  format={item.format}
                  isVisible={isVisible}
                  duration={2000}
                  className={`font-bold text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}
                />
                {/* Text labels removed as requested */}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}

// CountUp component for animating numbers
const CountUp = ({ end, format, isVisible, duration = 2000, className }) => {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const frameRef = useRef(0)
  const startTimeRef = useRef(null)

  useEffect(() => {
    if (!isVisible) return

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = timestamp - startTimeRef.current
      const percentage = Math.min(progress / duration, 1)

      // Easing function for smoother animation
      const easeOutQuad = (t) => t * (2 - t)
      const easedProgress = easeOutQuad(percentage)

      const currentCount = Math.floor(easedProgress * end)

      if (currentCount !== countRef.current) {
        countRef.current = currentCount
        setCount(currentCount)
      }

      if (percentage < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
    }
  }, [isVisible, end, duration])

  return <p className={className}>{format(count)}</p>
}

export default Cont1A