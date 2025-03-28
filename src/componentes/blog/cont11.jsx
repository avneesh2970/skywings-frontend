

import mountain from '../../assets/products/image(10).png'
import tech from "../../assets/products/image(11).png";
import desktop from "../../assets/products/image(3).png";
import sigleman from "../../assets/products/image(4).png";
import concentration from "../../assets/products/image(5).png";
import podcast from "../../assets/products/image(6).png";
import { MdArrowOutward } from "react-icons/md";



const Cont11=()=> {

    const articles = [
        {
          image: mountain,
          author: "Alec Whitten",
          date: "17 Jan 2022",
          title: "Bill Walsh leadership lessons",
          description:
            "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
          tags: ["Leadership", "Management"],
          
        },
        {
          image: tech,
          author: "Demi Wilkinson",
          date: "16 Jan 2022",
          title: "PM mental models",
          description:
            "Mental models are simple expressions of complex processes or relationships.",
          tags: ["Product", "Research", "Frameworks"],
        },
        {
          image: desktop,
          author: "Candice Wu",
          date: "15 Jan 2022",
          title: "What is Wireframing?",
          description:
            "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
          tags: ["Design", "Research"],
        },
        {
          image: sigleman,
          author: "Natali Craig",
          date: "14 Jan 2022",
          title: "How collaboration makes us better designers",
          description:
            "Collaboration can make our teams stronger, and our individual designs better.",
          tags: ["Design", "Research"],
        },
        {
          image: concentration,
          author: "Drew Cano",
          date: "13 Jan 2022",
          title: "Our top 10 Javascript frameworks to use",
          description:
            "JavaScript frameworks make development easy with extensive features and functionalities.",
          tags: ["Software Development", "Tools", "SaaS"],
        },
        {
          image: podcast,
          author: "Orlando Diggs",
          date: "12 Jan 2022",
          title: "Podcast: Creating a better CX Community",
          description:
            "Starting a community doesn’t need to be complicated, but how do you get started?",
          tags: ["Podcasts", "Customer Success"],
          
        },
        
      ];
  return (
    <>
    <div className='text-center  mt-20'>
        <span className='bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full uppercase'>Case Study</span>
      {/* <h1 className='font-bold text-5xl  my-3'>Stories and interviews</h1> */}
      <p className='text-gray-500 mt-4 text-lg'>Subscribe to learn about new project features, the latest in technology,<br/> solutions, and update</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 lg:mx-20 w-85 m-auto md:w-auto   ">
      
      {articles.map((article, index) => (
        <div
          key={index}
          className="bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full object-cover"
          />
          <div className="p-4 relative">   {/* relative for arrow*/ }
          <MdArrowOutward className='absolute right-3 top-13'/>
            <p className="text-sm text-purple-500 mb-2">
              {article.author} • {article.date}
            </p>
            <h3 className="text-lg font-semibold mb-2 w-80">{article.title}</h3>
            <p className="text-gray-500 text-sm mb-4">{article.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-2xl"
                >
                  {tag}
                </span>
              ))}
              
            </div>
           
          </div>
        </div>
    
  
      ))}


    </div>
    </>
    )
}
export default Cont11;