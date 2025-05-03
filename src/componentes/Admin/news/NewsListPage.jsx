import NewsManagement from "./NewsManagement"

const NewsListPage = () => {
  return (
    <div>
      {/* <div className="mb-6"> */}
        {/* <h1 className="text-2xl font-bold text-gray-800">News Management</h1> */}
        {/* <p className="text-gray-600">Manage all news articles from here</p> */}
      {/* </div> */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-50 py-12 px-4 rounded-xl mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">Skywings</span> News
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover news, insights, and knowledge from our community
          </p>
        
        </div>
      </div>
      <NewsManagement />
    </div>
  )
}

export default NewsListPage
