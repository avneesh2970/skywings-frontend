import mountain from "../../assets/products/image(10).png";
import tech from "../../assets/products/image(11).png";
import desktop from "../../assets/products/image(3).png";
import podcast from "../../assets/products/image(6).png";
import singleman from "../../assets/products/image(4).png";
import img33 from '../../assets/service/image33.png'
import img36 from '../../assets/service/image36.png'
import img49 from '../../assets/service/image49.png'
import concentration from "../../assets/products/image(5).png";
import { MdArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";

// import {imgy} from "../../assets/products/image (4).png";

const Cont10 = () => {
  // console.log("imgy", imgy)
  const articles = [
    {
      id: 1,
      image: mountain,
      author: "Admin",
      date: "March 25, 2025",
      jobtype: "Recruitment",
      title: "Busted No Show Reasons ",
      description:
        "I met with an accident!”, “My best friend is hospitalized”, “I am unwell”, “My grandparent expired”, “important meeting at office scheduled and I got the update last night”, either..",

      },
    {
      id: 2,
      image: podcast,
      author: "Admin",
      date: "march 25, 2025",
      jobtype: "Interview Tips",
      title: "The One Thing Every Employer Wants to See On Your Resume",
      description:
        "It’s tough out there in the job market. And it may be getting tougher if you are following the news. You are It’s tough ..",
      

      },

    {
      id: 3,
      image: tech,
      author: "Admin",
      date: "March 25, 2025",
      jobtype: "Company Culter ",
      title: "How to create a culture of leadership",
      description:
        "Culture is a composition of 'Intellectual Activity'. In this competitive world, a key factor behind a company's success, apart from .",

      descriptionA:
        "Culture is a composition of 'Intellectual Activity'. In this competitive world, a key factor behind a company's success, apart from product differentiation and quality of service, is its culture. One of the most important aspects of culture is the pursuit of transforming employees into leaders. So, how does a company go about achieving this?",

      txt4: "Give Ownership-",
      txt5: "Ownership plays a big role here. Believe and let employees own their role, make them accountable for the tasks in hand and see how they develop. Responsibility imposes the mind to think beyond the visible horizon. It enhances productivity since bringing the outcome is in the hands of the owner which necessarily mean it has to be the best.",

      txt6: "Role Rotation-",
      txt7: "Role rotation or switch is another feature in transforming employees into leaders. This would essentially mean that high potential employees should be exposed to a set of functions and not just one. What is expected of a leader is that he should be abreast of all the nuts and bolts of the company. He should hold a holistic view of the company and be able to examine the different facets of the business through his knowledge and understanding and therefore, it is important that employees of the organization are allowed exposure to all inter-linked functions.",

      txt8: "For instance,",
      txt9: " an employee in product development should also be exposed to product marketing to understand the market trends, competition and in turn use that information for enhancements. It will prepare him for an elevated role by making him a better developer.",

      txt10: "Find Your Core- ",
      txt11:
        "However, giving opportunities like these cannot be random for there are possible chances of confusion and unilateral decision-making. Hence, this should be properly planned and structured keeping the Vision of the company and most importantly the core business in range. So, if you are in the business of developing software for the hospitality industry, every person in the product team must feel responsible towards the design and the product getting developed. Focus cannot just shift away from the nucleus of the company and the culture should thoroughly imbibe it.",

      txt14: "Leader Shows the Way- ",
      txt15:
        "Having emphasized on the theme of empowerment, it must be evident that we rule out the process of 'micro-management' completely in the company. What works is leadership of participative style, which is to say that leaders show the path, trust and delegate responsibilities, create ownership in roles and stay juxtapose to guide if required. He must see the picture through the company's eyes.",

      txt16: "Liberty to Speak Your Mind- ",
      txt17:
        "When you say you have a workforce who is empowered there is a level of liberty which is a must and should be bestowed upon them to make an expression of their thoughts.",

      txt18: "Define Clarity of Purpose- ",
      txt19:
        "Creating a culture of leadership comes naturally for a startup when the team is small and everyone swims together. It is only when you start reaching scale that you need to start talking about creating a culture of leadership. The clarity of purpose as to why it is important to create such a culture must be established.",

      txt20: "Walk the Talk- ",
      txt21:
        "Merely defining and laying down components of a successful culture is not sufficient. In fact following and believing in it is very crucial for its success, which is why should be - 'Walk the Talk'. A culture of leadership thrives best when employees are recognized for their contribution and where applauses and rewards follow suit.",
    },
    {
      id: 4,
      image: desktop,
      author: "Admin",
      date: "March 25, 2025",
      jobtype: "Interview Tips",
      title: "Basic questions asked in any job Interview",
      description:
        "It’s a well known fact that looking at a candidate’s past behaviour is the best way to predict their future",
      
    },
    {
    id: 5,
      image: singleman,
      author: "Admin",
      date: "March 25, 2025",
      jobtype: "Placement",
      title: "How College Placement Cells Can Improve Student Employability ",
      description:
        "A college’s placement cell plays a crucial role in shaping the future of students by connecting them with...."
  },
    {
    id: 6,
      image: concentration ,
      author: "Admin",
      date: "March 26, 2025",
      jobtype: "Internship",
      title: "Internship Programs: Why They Are Essential for Career Growth ",
      description:
        "India is home to one of the world’s largest and youngest workforces, yet many industries face a severe skill ..." 
  },
    {
    id: 7,
      image: img33,
      author: "Admin",
      date: "March 25, 2025",
      jobtype: "Skill Gap",
      title: " Skill Gap in India: How to Bridge It Through Training & Recruitment ",
      description:
        "Skill Gap in India: How to Bridge It Through Training & Recruitment Introduction: The Growing Skill Gap in .."
  },
    {
    id: 8,
      image: img36,
      author: "Admin",
      date: "March 22, 2025",
      jobtype: "Resume",
      title: "How to Optimize Your Resume for ATS  ",
      description:
        "Applicant Tracking Systems (ATS). ATS is an AI-driven resume screening tool used by companies to filter..."
  },
    {
    id: 9,
      image: img49,
      author: "Admin",
      date: "March 20, 2025",
      jobtype: " Hiring ",
      title: "How Staffing Companies Can Improve Diversity & Inclusion Hiring  ",
      description:
        "Introduction: The Growing Importance of Diversity & Inclusion in Hiring Diversity and inclusion (D&I) are..."
  },
    {
    id: 10,
      image: mountain,
      author: "Admin",
      date: "March 20, 2025",
      jobtype: " Pre-Placement ",
      title: "How Pre-Placement Offers (PPOs) Are Changing Campus Hiring",
      description:
       "Introduction: The Rise of Pre-Placement Offers (PPOs) in India Campus hiring has long been the primary ..."
  },
    {
    id: 11,
      image: mountain,
      author: "Admin",
      date: "March 18, 2025",
      jobtype: "Staffing  ",
      title: "Top Challenges in the Staffing Industry and How to Overcome Them",
      description:
        "Introduction: Why Staffing is More Challenging Than Ever The staffing industry  plays a crucial role..."
  },
    {
    id: 12,
      image: mountain,
      author: "Admin",
      date: "March 17, 2025",
      jobtype: "Recruitment  ",
      title: "The Role of Recruitment Agencies in India's Growing Job Market",
      description:
        "Introduction: Why Recruitment Agencies Are More Important Than Ever India’s job market is experiencing..."
  },
    {
    id: 13,
      image: mountain,
      author: "Admin",
      date: "March 11, 2025",
      jobtype: "AI  ",
      title: "How AI is Revolutionizing Talent Acquisition & the Staffing Industry",
      description:
       "Introduction: The Role of AI in Modern Recruitment The recruitment industry is undergoing a massive..."
  },
    {
    id: 14,
      image: mountain,
      author: "Admin",
      date: "March 11, 2025",
      jobtype: "Businesses ",
      title: "Understanding Whitepapers: A Comprehensive Guide for Businesses",
      description:
       "In the fast-paced world of digital content, businesses are constantly searching for ways to establish..."
  },
    {
    id: 15,
      image: mountain,
      author: "Admin",
      date: "March 11, 2025",
      jobtype: "Success ",
      title: "Competency Mapping: Unlocking Potential for Organizational Success",
      description:
       "In today’s dynamic and competitive market, businesses, especially in India, face the challenge of..."
  },
    {
    id: 16,
      image: mountain,
      author: "Admin",
      date: "March 15, 2025",
      jobtype: "W2 & C2C ",
      title: "Understanding W2 and C2C Employment Arrangements",
      description:
       "When engaging with staffing or recruitment agencies, prospective employees often encounter two..."
  },
  {
    id: 17,
      image: mountain,
      author: "Admin",
      date: "March 15, 2025",
      jobtype: "Freshers ",
      title: "How to source freshers",
      description:
       "Sourcing freshers for sales roles can be quite effective when using a multi-channel approach...."
  },
  {
    id: 18,
      image: mountain,
      author: "Admin",
      date: "March 15, 2025",
      jobtype: " FreelanceRecruiter.",
      title: "Closing the Skill Gap: How FreelanceRecruiter.in Supports Workforce  Readiness",
      description:
       "The Rise of Freelance Recruiters in India: Why More Companies Are Turning to Gig Talent for Hiring The "
  },
  {
    id: 19,
      image: mountain,
      author: "Admin",
      date: "March 15, 2025",
      jobtype: " FreelanceRecruiter.",
      title: "How can i become Freelance Recruiter",
      description:
       "Becoming a freelance recruiter can be a great career path if you have strong networking and... "
  },


  ];
  return (
    <>
      <div className="text-center  mt-10">
        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
          BLOG
        </span>
        <h1 className="font-bold lg:text-5xl text-3xl  my-3">
          Stories and interviews
        </h1>
        <p className="text-gray-500 mt-4 text-lg">
          Subscribe to learn about new project features, the latest in
          technology,
          <br /> solutions, and update
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 lg:mx-20 w-85 m-auto md:w-auto   ">
        {articles.map((article, index) => (
          <Link
            to={`/article/${article.id}`}
            state={article} // Pass article data
            className="text-purple-500 font-semibold"
            key={index}
          >
            <div
              key={index}
              className="bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full object-cover"
              />
              <div className="p-4 relative">
                {" "}
                {/* relative for arrow*/}
                <MdArrowOutward className="absolute right-3 top-5" />
                <h3 className="text-lg font-semibold mb-2 w-80">
                  {article.title}
                </h3>
                <p className="text-sm text-purple-500 mb-2">
                  <span className="text-black font-semibold">
                    {article.jobtype}{" "}
                  </span>
                  <span className="text-black">| By :</span> {article.author}{" "}
                  {""}
                  <span className="text-black">| Last Updates: </span>{" "}
                  {article.date}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  {article.description}
                </p>
                {/* <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-2xl"
                >
                  {tag}
                </span>
              ))}
              
            </div> */}
                <p>Read More...</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
export default Cont10;