/* eslint-disable react/prop-types */

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

const HeadingDropdown = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getCurrentHeadingText = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1"
    if (editor.isActive("heading", { level: 2 })) return "Heading 2"
    if (editor.isActive("heading", { level: 3 })) return "Heading 3"
    return "Paragraph"
  }

  const setHeading = (level) => {
    if (level === null) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level }).run()
    }
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        <span className="text-sm font-medium">{getCurrentHeadingText()}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200 animate-fadeIn">
          <button
            onClick={() => setHeading(null)}
            className={`w-full text-left px-4 py-2 text-sm ${
              editor.isActive("paragraph") ? "bg-gray-100 text-emerald-600" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Paragraph
          </button>
          <button
            onClick={() => setHeading(1)}
            className={`w-full text-left px-4 py-2 text-sm ${
              editor.isActive("heading", { level: 1 })
                ? "bg-gray-100 text-emerald-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Heading 1
          </button>
          <button
            onClick={() => setHeading(2)}
            className={`w-full text-left px-4 py-2 text-sm ${
              editor.isActive("heading", { level: 2 })
                ? "bg-gray-100 text-emerald-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Heading 2
          </button>
          <button
            onClick={() => setHeading(3)}
            className={`w-full text-left px-4 py-2 text-sm ${
              editor.isActive("heading", { level: 3 })
                ? "bg-gray-100 text-emerald-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Heading 3
          </button>
        </div>
      )}
    </div>
  )
}

export default HeadingDropdown
