import NewsManagement from "./NewsManagement"

const NewsListPage = () => {
  return (
    <div className="w-full max-w-full overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-blue-50 to-blue-50 py-8 sm:py-10 md:py-12 px-4 sm:px-6 rounded-xl mb-6 sm:mb-8 md:mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Welcome to <span className="text-blue-600">Skywings</span> News
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto">
            Discover news, insights, and knowledge from our community
          </p>
        </div>
      </div>
      <NewsManagement />
    </div>
  )
}

export default NewsListPage
