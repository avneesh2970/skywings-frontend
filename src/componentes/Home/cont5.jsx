"use client"

import { useState, useEffect, useRef } from "react"
import img from "../../assets/products/image.png"
import testm_1 from "../../assets/products/textm_1.jpg"
import testm_2 from "../../assets/products/testm_2.webp"
import testm_3 from "../../assets/products/testm_3.jpg"
import testm_4 from "../../assets/products/testm_4.jpg"

const Cont5 = () => {
  const clientTestimonials = [
    {
      id: 1,
      text: "Skywings Advisors has completely transformed our recruitment process. Their RPO solutions helped us reduce hiring time by 40% and ensured a continuous flow of top-tier candidates. We couldn't have asked for a better recruitment partner.",
      name: "Talent Acquisition Head",
      ac: "Global Insurance Broking",
    },
    {
      id: 2,
      text: "With Skywings managing our RPO needs, our HR team can now focus on strategic goals rather than operational hiring tasks. Their team is efficient, responsive, and deeply understands our industry.",
      name: "Director - Human Resources",
      ac: "Leading BFSI Company",
    },
    {
      id: 3,
      text: "We have been using Skywings' RPO services for over a year now, and they have consistently delivered high-quality candidates at scale. Their data-driven approach and strong recruitment team have been invaluable.",
      name: "VP - HR",
      ac: "Life Insurance",
    },
    {
      id: 4,
      text: "We needed skilled professionals on short notice, and Skywings Advisors delivered. Their contract staffing solutions helped us scale quickly without any administrative hassles.",
      name: "HR Manager",
      ac: "IT Consulting Firm",
    },
    {
      id: 5,
      text: "Skywings Advisors has been instrumental in providing contract-based workforce solutions for our projects. Their candidate quality and compliance handling are outstanding.",
      name: "Operations Head",
      ac: "Leading BPO",
    },
    {
      id: 6,
      text: "Their flexible staffing solutions have allowed us to manage seasonal workloads efficiently. The Skywings team understands our needs and provides quick turnarounds.",
      name: "HR Lead",
      ac: "Retail Company",
    },
    {
      id: 7,
      text: "Skywings Advisors made our campus hiring seamless. Their strong college network helped us onboard talented freshers who are now valuable assets to our company.",
      name: "Talent Acquisition Manager",
      ac: "FinTech Startup",
    },
    {
      id: 8,
      text: "We partnered with Skywings for our annual campus recruitment drive, and the results were outstanding. The team handled everything from screening to onboarding flawlessly.",
      name: "Head of HR",
      ac: "Engineering Services Company",
    },
    {
      id: 9,
      text: "Skywings Advisors connected us with top-tier colleges, helping us find future leaders for our organization. Their expertise in fresher hiring is unmatched.",
      name: "Recruitment Lead",
      ac: "ITES Company",
    },
    {
      id: 10,
      text: "Finding top leadership talent can be challenging, but Skywings Advisors made it look effortless. Their executive search team brought us highly competent leaders who align perfectly with our vision.",
      name: "CEO",
      ac: "EdTech Firm",
    },
    {
      id: 11,
      text: "Skywings Advisors helped us fill key C-suite positions with exceptional candidates. Their market intelligence and network in the industry gave us access to the best talent.",
      name: "Managing Director",
      ac: "Infrastructure Company",
    },
    {
      id: 12,
      text: "Their executive search team took the time to understand our leadership needs and delivered outstanding candidates. We are extremely satisfied with their services.",
      name: "Board Member",
      ac: "Healthcare Organization",
    },
    {
      id: 13,
      text: "Managing payroll and compliances can be a nightmare, but Skywings Advisors made it hassle-free for us. Their expertise in EPF, ESIC, and labor laws has been invaluable.",
      name: "CFO",
      ac: "Logistics Firm",
    },
    {
      id: 14,
      text: "Skywings Advisors ensured that our company stayed compliant with all labor regulations. Their HR support services have been a lifesaver.",
      name: "HR Head",
      ac: "E-commerce Startup",
    },
    {
      id: 15,
      text: "We were struggling with statutory compliances, but Skywings handled everything professionally. Now, we can focus on our core business without worrying about audits or penalties.",
      name: "Finance Manager",
      ac: "Automotive Company",
    },
    {
      id: 16,
      text: "Our business needed temp staff during peak seasons, and Skywings Advisors delivered promptly. Their candidates were well-trained and fit right into our teams.",
      name: "Operations Manager",
      ac: "Leading Bank",
    },
    {
      id: 17,
      text: "Thanks to Skywings, we never face workforce shortages during project surges. Their temporary staffing services are quick, reliable, and hassle-free.",
      name: "Project Head",
      ac: "IT Services Firm",
    },
    {
      id: 18,
      text: "We needed urgent temp hiring for our retail stores, and Skywings Advisors delivered within days. Their efficient process saved us valuable time.",
      name: "Regional HR Manager",
      ac: "Retail Chain",
    },
    {
      id: 19,
      text: "Skywings Advisors has been our go-to recruitment partner for years. Their team understands our needs and consistently delivers the right talent.",
      name: "Head of Talent Acquisition",
      ac: "Leading Stock Broking",
    },
    {
      id: 20,
      text: "From bulk hiring to senior positions, Skywings Advisors has handled all our staffing needs with professionalism and expertise. Highly recommended!",
      name: "HR Director",
      ac: "Leading Shared Services Firm",
    },
  ]

  const studentTestimonials = [
    {
      id: 1,
      text: ' "AssuredJob.com made my dream of working at HDFC Bank come true! Their recruiter guided me through the process, making it smooth and efficient."',
      image: testm_1,
      name: "Amit Sharma, Placed at HDFC Bank",
      ac: "Delhi",
    },
    {
      id: 2,
      text: "Thanks to their expert recruiters, I landed a high-paying job in life insurance at HDFC Life Insurance in just two weeks!",
      image: testm_2,
      name: "Neha Patel, Placed at HDFC Life Insurance ",
      ac: "Mumbai",
    },
    {
      id: 3,
      text: '"A seamless banking job placement experience—AssuredJob.com got me hired at HDFC Sales quickly!"',
      image: testm_3,
      name: "Rahul Verma, Placed at HDFC Sales ",
      ac: "",
    },
    {
      id: 4,
      text: "I switched from a sales role to financial services, thanks to AssuredJob.com and my placement at HDB Financial Services!",
      image: testm_4,
      name: "Priya Iyer, Placed at HDB Financial Services ",
      ac: "Chennai",
    },
    {
      id: 5,
      text: "AssuredJob.com provided career guidance, and now I work at HDFC Bank in a managerial role!",
      image: img,
      name: "Vikram Singh, Placed at HDFC Bank ",
      ac: "Pune",
    },
    {
      id: 6,
      text: "Their banking sector recruitment experts helped me secure my job at HDFC Bank faster than I expected!",
      image: img,
      name: "Nilesh Rao, Placed at HDFC Bank ",
      ac: "Hyderabad",
    },
    {
      id: 7,
      text: "I was struggling to break into the insurance sector, but AssuredJob.com placed me in HDFC Life Insurance effortlessly!",
      image: img,
      name: "Sonal Mehta, Placed at HDFC Life Insurance ",
      ac: "Jaipur",
    },
    {
      id: 8,
      text: "Best private banking recruitment agency! I got placed at Kotak Mahindra Bank hassle-free!",
      image: img,
      name: "Anjali Gupta, Placed at Kotak Mahindra Bank ",
      ac: "Noida",
    },
    {
      id: 9,
      text: "AssuredJob.com helped me secure a role in life insurance sales at Kotak Mahindra Life Insurance!",
      image: img,
      name: "Rajesh Nair, Placed at Kotak Mahindra Life Insurance ",
      ac: "Kochi",
    },
    {
      id: 10,
      text: "I was looking for a customer service job in banking, and AssuredJob.com made it possible with Kotak Mahindra Bank!",
      image: img,
      name: "Sneha Joshi, Placed at Kotak Mahindra Bank ",
      ac: "Hyderabad",
    },
    {
      id: 11,
      text: "A smooth recruitment process—I got placed at Kotak Mahindra Life Insurance with the best salary in my field!",
      image: img,
      name: "Manish Bhatia, Placed at Kotak Mahindra Life Insurance ",
      ac: "Chandigarh",
    },
    {
      id: 12,
      text: "Their banking sector job listings are excellent! I found my perfect role at Kotak Mahindra Bank!",
      image: img,
      name: "Pooja Mehta, Placed at Kotak Mahindra Bank",
      ac: "Indore",
    },
    {
      id: 13,
      text: "Looking for an insurance sales career? AssuredJob.com got me placed at Kotak Life Insurance in 10 days!",
      image: img,
      name: "Rahul Taneja, Placed at Kotak Mahindra Life Insurance ",
      ac: "Patna",
    },
    {
      id: 14,
      text: "I was unsure about my career path, but AssuredJob.com placed me at Kotak Mahindra Bank, and I couldn't be happier!",
      image: img,
      name: "Varsha Kapoor, Placed at Kotak Mahindra Bank ",
      ac: "Ahmedabad",
    },
    {
      id: 15,
      text: "I wanted a career in wealth management, and AssuredJob.com got me hired at Nuvama Wealth Management!",
      image: img,
      name: "Arjun Reddy, Placed at Nuvama Wealth Management ",
      ac: "Visakhapatnam",
    },
    {
      id: 16,
      text: "Best job consultancy for finance professionals—I joined Nuvama Wealth Management in no time!",
      image: img,
      name: "Swati Choudhary, Placed at Nuvama Wealth Management ",
      ac: "Noida",
    },
    {
      id: 17,
      text: "AssuredJob.com helped me switch from banking to investment advisory at Motilal Oswal!",
      image: img,
      name: "Rohit Malhotra, Placed at Motilal Oswal Financial Services ",
      ac: "Lucknow",
    },
    {
      id: 18,
      text: "I got my first finance job at Nuvama, and their recruitment process was smooth and transparent!",
      image: img,
      name: "Kavita Pillai, Placed at Nuvama Wealth Management ",
      ac: "Thiruvananthapuram",
    },
    {
      id: 19,
      text: "Highly recommend AssuredJob.com for anyone looking for wealth management careers!",
      image: img,
      name: "Sandeep Yadav, Placed at Motilal Oswal Financial Services ",
      ac: "Bhopal",
    },
    {
      id: 20,
      text: "I was looking for a portfolio management role, and AssuredJob.com helped me get placed at Nuvama!",
      image: img,
      name: "Ankur Mathur, Placed at Nuvama Wealth Management ",
      ac: "Nagpur",
    },
    {
      id: 21,
      text: "Their banking sector job listings are excellent! I found my perfect role at Kotak Mahindra Bank!",
      image: img,
      name: "Pooja Mehta, Placed at Kotak Mahindra Bank  ",
      ac: "Indore",
    },
    {
      id: 22,
      text: "Looking for an insurance sales career? AssuredJob.com got me placed at Kotak Life Insurance in 10 days!",
      image: img,
      name: "Rahul Taneja, Placed at Kotak Mahindra Life Insurance ",
      ac: "Patna",
    },
    {
      id: 23,
      text: "I was unsure about my career path, but AssuredJob.com placed me at Kotak Mahindra Bank, and I couldn't be happier!",
      image: img,
      name: "Varsha Kapoor, Placed at Kotak Mahindra Bank ",
      ac: "Ahmedabad",
    },
    {
      id: 24,
      text: "AssuredJob.com helped me switch from banking to investment advisory at Motilal Oswal!",
      image: img,
      name: "Rohit Malhotra, Placed at Motilal Oswal Financial Service ",
      ac: "Lucknow",
    },
    {
      id: 25,
      text: "I got my first finance job at Nuvama, and their recruitment process was smooth and transparent!",
      image: img,
      name: "Kavita Pillai, Placed at Nuvama Wealth Management ",
      ac: "Thiruvananthapuram",
    },
    {
      id: 26,
      text: "Highly recommend AssuredJob.com for anyone looking for wealth management careers!",
      image: img,
      name: "Sandeep Yadav, Placed at Motilal Oswal Financial Services ",
      ac: "NaSandeep Yadav, Placed at Motilal Oswal Financial Servicesgpur",
    },
    {
      id: 27,
      text: "I was looking for a portfolio management role, and AssuredJob.com helped me get placed at Nuvama!",
      image: img,
      name: "Ankur Mathur, Placed at Nuvama Wealth Management",
      ac: "Nagpur",
    },
    {
      id: 28,
      text: "My career in financial consulting started thanks to Motilal Oswal, where I was placed by AssuredJob.com!",
      image: img,
      name: "Nikita Sharma, Placed at Motilal Oswal Financial Services",
      ac: "Delhi",
    },
    {
      id: 29,
      text: "A great IT job portal—I secured a role at Sutherland Global Services in customer support!",
      image: img,
      name: "Nisha Kapoor, Placed at Sutherland Global Services ",
      ac: "Ghaziabad",
    },
    {
      id: 30,
      text: "AssuredJob.com's tech job listings helped me land a developer role at AeonX Digital!",
      image: img,
      name: "Kunal Saxena, Placed at AeonX Digital ",
      ac: "Meerut",
    },
  ]

  const freelancer = [
    {
      id: 1,
      name: "Amit Sharma, Delhi",
      text: "FreelanceRecruiter.in provides access to a premium candidate database and job portals, making hiring effortless!",
    },
    {
      id: 2,
      name: "Neha Patel, Mumbai",
      text: "Unlike other platforms, they provide a ready-made recruiter database, saving me hours of sourcing candidates.",
    },
    {
      id: 3,
      name: "Rahul Verma, Bangalore",
      text: "With their internal talent database and CRM, I focus on recruiting rather than manual sourcing!",
    },
    {
      id: 4,
      name: "Priya Iyer, Chennai",
      text: "The AI-powered database helps me match candidates faster. The best freelance recruiting platform!",
    },
    {
      id: 5,
      name: "Vikram Singh, Pune",
      text: "AssuredJob.com offers job portal access and verified leads, making hiring faster and stress-free!",
    },
    {
      id: 6,
      name: "Anjali Gupta, Jaipur",
      text: "Their recruitment training program helped me refine my sourcing skills and close better deals!",
    },
    {
      id: 7,
      name: "Rajesh Nair, Kochi",
      text: "I started with zero experience, but their one-on-one recruiter training made me confident in hiring.",
    },
    {
      id: 8,
      name: "Sneha Joshi, Hyderabad",
      text: "FreelanceRecruiter.in provides live training sessions that helped me master industry trends and negotiations.",
    },
    {
      id: 9,
      name: "Manish Bhatia, Chandigarh",
      text: "The continuous learning support helped me boost my placements and increase my earnings.",
    },
    {
      id: 10,
      name: "Pooja Mehta, Indore",
      text: "Their freelancer recruiter training helped me get better conversion rates and handle clients like a pro!",
    },
    {
      id: 11,
      name: "Arjun Reddy, Visakhapatnam",
      text: "I shifted from other freelancing platforms to AssuredJob.com because of their higher recruiter payouts!",
    },
    {
      id: 12,
      name: "Swati Choudhary, Noida",
      text: "Unlike other platforms, they offer transparent commissions and on-time payments without delays.",
    },
    {
      id: 13,
      name: "Rohit Malhotra, Lucknow",
      text: "I doubled my monthly earnings thanks to their better recruiter payouts and premium job roles!",
    },
    {
      id: 14,
      name: "Kavita Pillai, Thiruvananthapuram",
      text: "Their commission model is recruiter-friendly—no hidden charges, just real profits!",
    },
    {
      id: 15,
      name: "Sandeep Yadav, Bhopal",
      text: "FreelanceRecruiter.in ensures top recruiter commissions, and I get paid without chasing anyone!",
    },
    {
      id: 16,
      name: "Deepa Mukherjee, Kolkata",
      text: "Their job portal access and direct connections with hiring managers make my job super easy!",
    },
    {
      id: 17,
      name: "Abhishek Chauhan, Kanpur",
      text: "Having priority access to verified job postings means I never run out of work opportunities!",
    },
    {
      id: 18,
      name: "Shalini Das, Bhubaneswar",
      text: "Their integrated job portal is easy to navigate, helping me recruit efficiently!",
    },
    {
      id: 19,
      name: "Harish Kumar, Nashik",
      text: "Unlike other freelance platforms, they offer exclusive recruiter access to top companies!",
    },
    {
      id: 20,
      name: "Meera Sen, Patna",
      text: "Their job board integration helped me place 50+ candidates in my first three months!",
    },
    {
      id: 21,
      name: "Pranav Joshi, Surat",
      text: "FreelanceRecruiter.in handles client interactions, allowing me to focus on candidate sourcing!",
    },
    {
      id: 22,
      name: "Aparna Krishnan, Coimbatore",
      text: "They provide direct access to hiring managers, making recruiter-client communication smooth.",
    },
    {
      id: 23,
      name: "Varun Aggarwal, Ludhiana",
      text: "Handling clients used to be a challenge, but now I get pre-negotiated job mandates directly!",
    },
    {
      id: 24,
      name: "Simran Kaur, Amritsar",
      text: "Unlike other platforms, they provide end-to-end recruiter support—database, clients, and payouts!",
    },
    {
      id: 25,
      name: "Anand Bansal, Udaipur",
      text: "Their recruiter business model ensures that I get high-quality clients without extra effort.",
    },
    {
      id: 26,
      name: "Nisha Kapoor, Ghaziabad",
      text: "FreelanceRecruiter.in is the only platform that provides zero-cost recruiter onboarding with full transparency!",
    },
    {
      id: 27,
      name: "Kunal Saxena, Meerut",
      text: "Their automated hiring tools reduce my workload and make recruitment a breeze.",
    },
    {
      id: 28,
      name: "Lavanya Raj, Vijayawada",
      text: "I love their recruiter dashboard, where I can track earnings, candidates, and job status in real-time.",
    },
    {
      id: 29,
      name: "Sohail Ahmed, Guwahati",
      text: "Unlike other freelance platforms, they offer guaranteed recruiter support and dispute resolution.",
    },
    {
      id: 30,
      name: "Tarun Kapoor, Varanasi",
      text: "Their platform is built for recruiters—it's fast, efficient, and payment-friendly!",
    },
    {
      id: 31,
      name: "Deeksha Nair, Kozhikode",
      text: "Freelance recruiting is now my full-time profession, thanks to their consistent job opportunities!",
    },
    {
      id: 32,
      name: "Jitendra Chouhan, Jodhpur",
      text: "This is not just a side gig—it's a serious recruiting career with real growth potential.",
    },
    {
      id: 33,
      name: "Shruti Tiwari, Gwalior",
      text: "FreelanceRecruiter.in is the best platform for scaling a recruitment business!",
    },
    {
      id: 34,
      name: "Mohit Arora, Agra",
      text: "I moved from a job to freelance recruiting full-time, thanks to their steady work pipeline.",
    },
    {
      id: 35,
      name: "Reena Mishra, Ranchi",
      text: "Their freelancer-friendly policies help me focus on hiring and growing professionally.",
    },
    {
      id: 36,
      name: "Aditya Saxena, Jamshedpur",
      text: "Their pre-screened candidate list saves me time and improves my hiring success rate!",
    },
    {
      id: 37,
      name: "Pallavi Reddy, Mysore",
      text: "Their AI-driven job matching system helps me quickly connect the right candidate to the right job.",
    },
    {
      id: 38,
      name: "Naveen Joshi, Dehradun",
      text: "The candidate tracking tools help me manage multiple hiring projects effortlessly!",
    },
    {
      id: 39,
      name: "Juhi Chopra, Siliguri",
      text: "I never imagined freelance recruiting could be this easy with the right tools and support!",
    },
    {
      id: 40,
      name: "Sachin Thakur, Bareilly",
      text: "With their automated resume screening, I save time and increase my efficiency!",
    },
    {
      id: 41,
      name: "Poonam Aggarwal, Moradabad",
      text: "This is the most stable freelance recruitment platform I've worked with!",
    },
    {
      id: 42,
      name: "Santosh Menon, Mangalore",
      text: "They provide ongoing recruiter work, ensuring a steady income stream!",
    },
    {
      id: 43,
      name: "Manasi Kulkarni, Kolhapur",
      text: "AssuredJob.com guarantees job flow and candidate supply, making recruitment stress-free!",
    },
    {
      id: 44,
      name: "Aakash Pandey, Aligarh",
      text: "I've built my entire career around freelance recruiting with their job security and consistent payouts.",
    },
    {
      id: 45,
      name: "Ritika Sood, Gorakhpur",
      text: "Their long-term contracts mean I always have hiring opportunities.",
    },
    {
      id: 46,
      name: "Suhas Rane, Nagpur",
      text: "Unlike other freelance job portals, their client base is strong and reliable!",
    },
    {
      id: 47,
      name: "Arti Sinha, Dhanbad",
      text: "They offer continuous recruiter engagement, so I never feel out of work!",
    },
    {
      id: 48,
      name: "Rohan Kapoor, Bhilai",
      text: "They ensure freelancers get real work, not just empty job postings!",
    },
    {
      id: 49,
      name: "Tanvi Dubey, Anand",
      text: "Finally, a trustworthy freelance recruiter network that delivers real results!",
    },
    {
      id: 50,
      name: "Sandeep Rawat, Ajmer",
      text: "FreelanceRecruiter.in is a game-changer for recruiter careers!",
    },
  ]

  const [screenSize, setScreenSize] = useState("")
  const [visibleCount, setVisibleCount] = useState(5)

  // Refs for the scrolling containers
  const clientScrollRef = useRef(null)
  const studentScrollRef = useRef(null)
  const freelancerScrollRef = useRef(null)

  // Animation speed in pixels per second - Adjust this value to control the scrolling speed
  // You can modify this value to make the scrolling faster or slower
  const scrollSpeed = 50 // pixels per second

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setScreenSize("xs")
        setVisibleCount(1)
      } else if (width < 768) {
        setScreenSize("sm")
        setVisibleCount(2)
      } else if (width < 1024) {
        setScreenSize("md")
        setVisibleCount(3)
      } else {
        setScreenSize("lg")
        setVisibleCount(5)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Function to duplicate testimonials for smooth infinite scrolling
  const duplicateTestimonials = (testimonials) => {
    return [...testimonials, ...testimonials]
  }

  // Duplicate all testimonial arrays for infinite scrolling
  const duplicatedClientTestimonials = duplicateTestimonials(clientTestimonials)
  const duplicatedStudentTestimonials = duplicateTestimonials(studentTestimonials)
  const duplicatedFreelancerTestimonials = duplicateTestimonials(freelancer)

  // Set up the scrolling animation for each section
  useEffect(() => {
    // Function to handle the scrolling animation
    const animateScroll = (scrollContainer, contentWidth) => {
      if (!scrollContainer) return

      let scrollPosition = 0
      let lastTimestamp = 0

      const step = (timestamp) => {
        if (!lastTimestamp) lastTimestamp = timestamp
        const elapsed = timestamp - lastTimestamp

        // Calculate how much to scroll based on time elapsed and scroll speed
        const pixelsToScroll = (scrollSpeed * elapsed) / 1000

        scrollPosition += pixelsToScroll

        // Reset position when we've scrolled through half the content (original set)
        if (scrollPosition >= contentWidth / 2) {
          scrollPosition = 0
        }

        // Apply the scroll position
        if (scrollContainer.current) {
          scrollContainer.current.style.transform = `translateX(-${scrollPosition}px)`
        }

        lastTimestamp = timestamp
        requestAnimationFrame(step)
      }

      const animationId = requestAnimationFrame(step)

      // Clean up animation on unmount
      return () => cancelAnimationFrame(animationId)
    }

    // Get the width of the content for each section
    const getContentWidth = (testimonials, cardWidth) => {
      // We only need to scroll through the original set, not the duplicated one
      return testimonials.length * cardWidth
    }

    // Calculate card width based on visible count
    const cardWidth = 320 + 12 // card width + gap

    // Start animations for each section
    const clientAnimation = animateScroll(clientScrollRef, getContentWidth(clientTestimonials, cardWidth))

    const studentAnimation = animateScroll(studentScrollRef, getContentWidth(studentTestimonials, cardWidth))

    const freelancerAnimation = animateScroll(freelancerScrollRef, getContentWidth(freelancer, cardWidth))

    // Clean up animations on unmount
    return () => {
      clientAnimation && clientAnimation()
      studentAnimation && studentAnimation()
      freelancerAnimation && freelancerAnimation()
    }
  }, [clientTestimonials.length, studentTestimonials.length, freelancer.length, scrollSpeed, visibleCount])

  // Testimonial card - Updated to reduce empty space while maintaining equal heights
  const renderTestimonialCard = (data, index) => (
    <div
      key={index}
      className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between w-full mx-auto transition-all duration-300 hover:shadow-xl"
      style={{
        minWidth: "300px",
        width: "300px",
        margin: "0 6px",
        height: "220px", // Reduced height to minimize empty space
      }}
    >
      {/* Text container with limited height */}
      <div className="mb-3">
        <p className="text-gray-700 text-sm line-clamp-5">{data.text}</p>
      </div>

      {/* Footer with author info - always at the bottom */}
      <div className="flex items-center w-full mt-auto">
        {data.image && (
          <img
            src={data.image || "/placeholder.svg"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
          />
        )}
        <div className="text-left ml-2 flex-1">
          <p className="text-sm text-center font-semibold text-gray-800">{data.name}</p>
          {data.ac && <span className="text-xs flex justify-center text-purple-500">{data.ac}</span>}
        </div>
      </div>
    </div>
  )

  // Render a section with horizontal scrolling testimonials
  const renderScrollingSection = (testimonials, duplicatedTestimonials, scrollRef, title) => (
    <div className="w-full max-w-8xl mx-auto my-10">
      <p className="text-purple-600 mb-4 text-xl font-medium">{title}</p>

      <div className="relative overflow-hidden">
        <div className="overflow-hidden">
          {/* The scrolling container */}
          <div
            className="flex"
            ref={scrollRef}
            style={{
              willChange: "transform",
              transition: "transform 0.1s linear",
            }}
          >
            {duplicatedTestimonials.map((item, index) => renderTestimonialCard(item, `${item.id}-${index}`))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-purple-50 py-16 text-center flex flex-col items-center px-4 md:px-12">
      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-4 py-1.5 rounded-full">TESTIMONIALS</span>
      <h1 className="text-4xl text-[#42307D] font-bold my-6">Don&apos;t just take our word for it</h1>

      {renderScrollingSection(
        clientTestimonials,
        duplicatedClientTestimonials,
        clientScrollRef,
        "Read what our clients have to say",
      )}

      {renderScrollingSection(
        studentTestimonials,
        duplicatedStudentTestimonials,
        studentScrollRef,
        "See what our recently joined candidates have to say",
      )}

      {renderScrollingSection(
        freelancer,
        duplicatedFreelancerTestimonials,
        freelancerScrollRef,
        "Read what our Freelance Recruiters have to say",
      )}
    </div>
  )
}

export default Cont5
