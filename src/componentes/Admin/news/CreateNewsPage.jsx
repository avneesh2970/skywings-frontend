"use client"
import NewsForm from "./NewsForm"

const CreateNewsPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create News Article</h1>
        <p className="text-gray-600">Add a new news article to your website</p>
      </div>

      <NewsForm />
    </div>
  )
}

export default CreateNewsPage
