"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import axios from "axios"
import { Loader2 } from 'lucide-react'
import NewsForm from "./NewsForm"

const EditNewsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [newsItem, setNewsItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news/${id}`)
        setNewsItem(response.data)
      } catch (err) {
        console.error("Error fetching news item:", err)
        setError("Failed to load news article")
        toast.error("Failed to load news article")
      } finally {
        setLoading(false)
      }
    }

    fetchNewsItem()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading news article...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
        <button onClick={() => navigate("/admin/dashboard/news")} className="mt-2 text-sm text-blue-600 hover:underline">
          Back to News List
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit News Article</h1>
        <p className="text-gray-600">Update the news article details</p>
      </div>

      {newsItem && <NewsForm newsItem={newsItem} />}
    </div>
  )
}

export default EditNewsPage
