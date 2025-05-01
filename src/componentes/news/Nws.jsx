import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import axios from "axios";
import mountain from "../../assets/products/image(10).png";
import tech from "../../assets/products/image(11).png";
import desktop from "../../assets/products/image(3).png";
import sigleman from "../../assets/products/image(4).png";
import concentration from "../../assets/products/image(5).png";
import podcast from "../../assets/products/image(6).png";

export default function Nws() {
  const [dynamicNews, setDynamicNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/news`,
          {
            params: {
              limit: 6, // Limit to 6 latest news articles
              sort: "date", // Sort by date
              order: "desc", // Newest first
              status: "published", // Only published articles
            },
          }
        );
        
        // Map the API response to match our article format
        const apiNews = response.data.data.map(item => ({
          id: item._id, // Use MongoDB _id
          image: item.image ? `${import.meta.env.VITE_API_URL}${item.image}` : null,
          author: item.author,
          date: new Date(item.date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          title: item.title,
          description: item.description,
          tags: item.tags || [],
          isFromApi: true // Flag to identify API news
        }));
        
        setDynamicNews(apiNews);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news articles");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Existing hardcoded articles
  const staticArticles = [
    {
      id: 1,
      image: mountain,
      author: "Alec Whitten",
      date: "17 Jan 2022",
      title: "Bill Walsh leadership lessons",
      description: "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
      tags: ["Leadership", "Management"],
      isFromApi: false, // Explicitly mark as static
    },
    {
      id: 2,
      image: tech,
      author: "Demi Wilkinson",
      date: "16 Jan 2022",
      title: "PM mental models",
      description: "Mental models are simple expressions of complex processes or relationships.",
      tags: ["Product", "Research", "Frameworks"],
      isFromApi: false,
    },
    {
      id: 3,
      image: desktop,
      author: "Candice Wu",
      date: "15 Jan 2022",
      title: "What is Wireframing?",
      description: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
      tags: ["Design", "Research"],
      isFromApi: false,
    },
    {
      id: 4,
      image: sigleman,
      author: "Natali Craig",
      date: "14 Jan 2022",
      title: "How collaboration makes us better designers",
      description: "Collaboration can make our teams stronger, and our individual designs better.",
      tags: ["Design", "Research"],
      isFromApi: false,
    },
    {
      id: 5,
      image: concentration,
      author: "Drew Cano",
      date: "13 Jan 2022",
      title: "Our top 10 Javascript frameworks to use",
      description: "JavaScript frameworks make development easy with extensive features and functionalities.",
      tags: ["Software Development", "Tools", "SaaS"],
      isFromApi: false,
    },
    {
      id: 6,
      image: podcast,
      author: "Orlando Diggs",
      date: "12 Jan 2022",
      title: "Podcast: Creating a better CX Community",
      description: "Starting a community doesn't need to be complicated, but how do you get started?",
      tags: ["Podcasts", "Customer Success"],
      isFromApi: false,
    },
    {
      id: 7,
      image: sigleman,
      author: "Natali Craig • ",
      date: "14 Jan 2022",
      title: "How collaboration makes us better designers",
      description: "Collaboration can make our teams stronger, and our individual designs better.",
      tags: ["Design", "Research"],
      isFromApi: false,
    },
    {
      id: 8,
      image: concentration,
      author: "Drew Cano ",
      date: "13 Jan 2022",
      title: "Our top 10 Javascript frameworks to use",
      description: "JavaScript frameworks make development easy with extensive features and functionalities.",
      tags: ["Software Development", "Tools", "SaaS"],
      isFromApi: false,
    },
    {
      id: 9,
      image: podcast,
      author: "Orlando Diggs • ",
      date: "12 Jan 2022",
      title: "Podcast: Creating a better CX Community",
      description: "Starting a community doesn't need to be complicated, but how do you get started?",
      tags: ["Podcasts", "Customer Success"],
      isFromApi: false,
    },
  ];

  // Combine dynamic and static news
  // Put dynamic news first, then static news
  const allArticles = [...dynamicNews, ...staticArticles];

  return (
    <div className="bg-gray-50">
      <div className="text-center py-12 px-4">
        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">News</span>
        <h1 className="font-bold lg:text-5xl text-3xl my-3">News About Us</h1>
        <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
          Subscribe to learn about new project features, the latest in technology, solutions, and update
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto pb-16">
          {allArticles.map((article, index) => (
            <Link
              to={`/news/${article.id}`}
              state={{ isDynamic: article.isFromApi }}
              key={`${article.isFromApi ? 'dynamic' : 'static'}-${article.id}-${index}`}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    console.error("Image failed to load:", article.image);
                    e.target.src = "/placeholder.svg";
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                />
              </div>
              <div className="p-5 flex flex-col flex-grow relative">
                <MdArrowOutward className="absolute right-5 top-5 text-purple-500 text-xl" />
                <p className="text-sm text-purple-600 mb-2 font-medium">
                  {article.author} • {article.date}
                </p>
                <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{article.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {article.tags && article.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}