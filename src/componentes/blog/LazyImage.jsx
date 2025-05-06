/* eslint-disable react/prop-types */

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const LazyImage = ({ src, alt, className = "", variants, whileHover }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [imageSrc, setImageSrc] = useState("")

  useEffect(() => {
    // Reset states when src changes
    setLoaded(false)
    setError(false)

    const img = new Image()
    img.src = src

    img.onload = () => {
      setImageSrc(src)
      setLoaded(true)
    }

    img.onerror = () => {
      setError(true)
      setImageSrc("/placeholder.svg")
      setLoaded(true)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <motion.img
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        variants={variants}
        whileHover={whileHover}
      />
    </div>
  )
}

export default LazyImage
