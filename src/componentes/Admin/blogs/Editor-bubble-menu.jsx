/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { BubbleMenu } from "@tiptap/react"
import { Bold, Italic, Link, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { useState, useCallback } from "react"


const EditorBubbleMenu = ({ editor, onSetLink }) => {
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")

  const bubbleMenuProps= {
    tippyOptions: {
      duration: 100,
      animation: "fade",
      moveTransition: "transform 0.15s ease-out",
    },
  }

  const handleLinkSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (linkUrl) {
        editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      } else {
        editor.chain().focus().extendMarkRange("link").unsetLink().run()
      }
      setIsLinkMenuOpen(false)
    },
    [editor, linkUrl],
  )

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor, view, state, from, to }) => {
        // Don't show if selection is empty or if the selection is a node selection
        if (from === to || editor.isActive("image")) {
          return false
        }
        return true
      }}
      {...bubbleMenuProps}
    >
      <div className="flex bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
        {isLinkMenuOpen ? (
          <form onSubmit={handleLinkSubmit} className="flex p-1">
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="text-sm px-2 py-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-emerald-500 w-60"
              autoFocus
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white text-sm px-2 py-1 rounded-r-md hover:bg-emerald-700"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => setIsLinkMenuOpen(false)}
              className="ml-1 bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 ${editor.isActive("bold") ? "bg-gray-100 text-emerald-600" : "text-gray-700"}`}
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 ${editor.isActive("italic") ? "bg-gray-100 text-emerald-600" : "text-gray-700"}`}
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const url = editor.getAttributes("link").href
                setLinkUrl(url || "")
                setIsLinkMenuOpen(true)
              }}
              className={`p-2 ${editor.isActive("link") ? "bg-gray-100 text-emerald-600" : "text-gray-700"}`}
            >
              <Link className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1 self-center"></div>
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`p-2 ${
                editor.isActive({ textAlign: "left" }) ? "bg-gray-100 text-emerald-600" : "text-gray-700"
              }`}
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={`p-2 ${
                editor.isActive({ textAlign: "center" }) ? "bg-gray-100 text-emerald-600" : "text-gray-700"
              }`}
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`p-2 ${
                editor.isActive({ textAlign: "right" }) ? "bg-gray-100 text-emerald-600" : "text-gray-700"
              }`}
            >
              <AlignRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </BubbleMenu>
  )
}

export default EditorBubbleMenu
