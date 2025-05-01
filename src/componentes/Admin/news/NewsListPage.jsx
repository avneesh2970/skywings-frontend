import NewsManagement from "./NewsManagement"

const NewsListPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">News Management</h1>
        <p className="text-gray-600">Manage all news articles from here</p>
      </div>

      <NewsManagement />
    </div>
  )
}

export default NewsListPage
