"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import img from "../../assets/products/image.png";
import testm_1 from "../../assets/products/textm_1.jpg";
import testm_2 from "../../assets/products/testm_2.webp";
import testm_3 from "../../assets/products/testm_3.jpg";
import testm_4 from "../../assets/products/testm_4.jpg";
import Newslettr from "../newsletter/Newslettr";
import FAQAccordion from "../Carrier/FAQAccordion";
import EventsDisplay from "./EventsCards";
import Contact from "./contactForm/Contact";
import BlogDisplay from "./BlogsCards";
import NewsDisplay from "./NewsCards";

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
  ];

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
      ac: "Bangalore",
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
      ac: "Patna",
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
  ];

  const freelancerTestimonials = [
    {
      id: 1,
      name: "Amit Sharma",
      text: "FreelanceRecruiter.in provides access to a premium candidate database and job portals, making hiring effortless!",
      ac: "Delhi",
    },
    {
      id: 2,
      name: "Neha Patel",
      text: "Unlike other platforms, they provide a ready-made recruiter database, saving me hours of sourcing candidates.",
      ac: "Mumbai",
    },
    {
      id: 3,
      name: "Rahul Verma",
      text: "With their internal talent database and CRM, I focus on recruiting rather than manual sourcing!",
      ac: "Bangalore",
    },
    {
      id: 4,
      name: "Priya Iyer",
      text: "The AI-powered database helps me match candidates faster. The best freelance recruiting platform!",
      ac: "Chennai",
    },
    {
      id: 5,
      name: "Vikram Singh",
      text: "AssuredJob.com offers job portal access and verified leads, making hiring faster and stress-free!",
      ac: "Pune",
    },
    {
      id: 6,
      name: "Anjali Gupta",
      text: "Their recruitment training program helped me refine my sourcing skills and close better deals!",
      ac: "Jaipur",
    },
    {
      id: 7,
      name: "Rajesh Nair",
      text: "I started with zero experience, but their one-on-one recruiter training made me confident in hiring.",
      ac: "Kochi",
    },
    {
      id: 8,
      name: "Sneha Joshi",
      text: "FreelanceRecruiter.in provides live training sessions that helped me master industry trends and negotiations.",
      ac: "Hyderabad",
    },
    {
      id: 9,
      name: "Manish Bhatia",
      text: "The continuous learning support helped me boost my placements and increase my earnings.",
      ac: "Chandigarh",
    },
    {
      id: 10,
      name: "Pooja Mehta",
      text: "Their freelancer recruiter training helped me get better conversion rates and handle clients like a pro!",
      ac: "Indore",
    },
    {
      id: 11,
      name: "Arjun Reddy",
      text: "I shifted from other freelancing platforms to AssuredJob.com because of their higher recruiter payouts!",
      ac: "Visakhapatnam",
    },
    {
      id: 12,
      name: "Swati Choudhary",
      text: "Unlike other platforms, they offer transparent commissions and on-time payments without delays.",
      ac: "Noida",
    },
    {
      id: 13,
      name: "Rohit Malhotra",
      text: "I doubled my monthly earnings thanks to their better recruiter payouts and premium job roles!",
      ac: "Lucknow",
    },
    {
      id: 14,
      name: "Kavita Pillai",
      text: "Their commission model is recruiter-friendly—no hidden charges, just real profits!",
      ac: "Thiruvananthapuram",
    },
    {
      id: 15,
      name: "Sandeep Yadav",
      text: "FreelanceRecruiter.in ensures top recruiter commissions, and I get paid without chasing anyone!",
      ac: "Bhopal",
    },
    {
      id: 16,
      name: "Deepa Mukherjee",
      text: "Their job portal access and direct connections with hiring managers make my job super easy!",
      ac: "Kolkata",
    },
    {
      id: 17,
      name: "Abhishek Chauhan",
      text: "Having priority access to verified job postings means I never run out of work opportunities!",
      ac: "Kanpur",
    },
    {
      id: 18,
      name: "Shalini Das",
      text: "Their integrated job portal is easy to navigate, helping me recruit efficiently!",
      ac: "Bhubaneswar",
    },
    {
      id: 19,
      name: "Harish Kumar",
      text: "Unlike other freelance platforms, they offer exclusive recruiter access to top companies!",
      ac: "Nashik",
    },
    {
      id: 20,
      name: "Meera Sen",
      text: "Their job board integration helped me place 50+ candidates in my first three months!",
      ac: "Patna",
    },
    {
      id: 21,
      name: "Pranav Joshi",
      text: "FreelanceRecruiter.in handles client interactions, allowing me to focus on candidate sourcing!",
      ac: "Surat",
    },
    {
      id: 22,
      name: "Aparna Krishnan",
      text: "They provide direct access to hiring managers, making recruiter-client communication smooth.",
      ac: "Coimbatore",
    },
    {
      id: 23,
      name: "Varun Aggarwal",
      text: "Handling clients used to be a challenge, but now I get pre-negotiated job mandates directly!",
      ac: "Ludhiana",
    },
    {
      id: 24,
      name: "Simran Kaur",
      text: "Unlike other platforms, they provide end-to-end recruiter support—database, clients, and payouts!",
      ac: "Amritsar",
    },
    {
      id: 25,
      name: "Anand Bansal",
      text: "Their recruiter business model ensures that I get high-quality clients without extra effort.",
      ac: "Udaipur",
    },
    {
      id: 26,
      name: "Nisha Kapoor",
      text: "FreelanceRecruiter.in is the only platform that provides zero-cost recruiter onboarding with full transparency!",
      ac: "Ghaziabad",
    },
    {
      id: 27,
      name: "Kunal Saxena",
      text: "Their automated hiring tools reduce my workload and make recruitment a breeze.",
      ac: " Meerut",
    },
    {
      id: 28,
      name: "Lavanya Raj",
      text: "I love their recruiter dashboard, where I can track earnings, candidates, and job status in real-time.",
      ac: "Vijayawada",
    },
    {
      id: 29,
      name: "Sohail Ahmed",
      text: "Unlike other freelance platforms, they offer guaranteed recruiter support and dispute resolution.",
      ac: "Guwahati",
    },
    {
      id: 30,
      name: "Tarun Kapoor",
      text: "Their platform is built for recruiters—it's fast, efficient, and payment-friendly!",
      ac: "Varanasi",
    },
    {
      id: 31,
      name: "Deeksha Nair",
      text: "Freelance recruiting is now my full-time profession, thanks to their consistent job opportunities!",
      ac: "Kozhikode",
    },
    {
      id: 32,
      name: "Jitendra Chouhan",
      text: "This is not just a side gig—it's a serious recruiting career with real growth potential.",
      ac: "Jodhpur",
    },
    {
      id: 33,
      name: "Shruti Tiwari",
      text: "FreelanceRecruiter.in is the best platform for scaling a recruitment business!",
      ac: "Gwalior",
    },
    {
      id: 34,
      name: "Mohit Arora",
      text: "I moved from a job to freelance recruiting full-time, thanks to their steady work pipeline.",
      ac: "Agra",
    },
    {
      id: 35,
      name: "Reena Mishra",
      text: "Their freelancer-friendly policies help me focus on hiring and growing professionally.",
      ac: "Ranchi",
    },
    {
      id: 36,
      name: "Aditya Saxena",
      text: "Their pre-screened candidate list saves me time and improves my hiring success rate!",
      ac: "Jamshedpur",
    },
    {
      id: 37,
      name: "Pallavi Reddy",
      text: "Their AI-driven job matching system helps me quickly connect the right candidate to the right job.",
      ac: "Mysore",
    },
    {
      id: 38,
      name: "Naveen Joshi",
      text: "The candidate tracking tools help me manage multiple hiring projects effortlessly!",
      ac: "Dehradun",
    },
    {
      id: 39,
      name: "Juhi Chopra",
      text: "I never imagined freelance recruiting could be this easy with the right tools and support!",
      ac: "Siliguri",
    },
    {
      id: 40,
      name: "Sachin Thakur",
      text: "With their automated resume screening, I save time and increase my efficiency!",
      ac: "Bareilly",
    },
    {
      id: 41,
      name: "Poonam Aggarwal",
      text: "This is the most stable freelance recruitment platform I've worked with!",
      ac: "Moradabad",
    },
    {
      id: 42,
      name: "Santosh Menon",
      text: "They provide ongoing recruiter work, ensuring a steady income stream!",
      ac: "Mangalore",
    },
    {
      id: 43,
      name: "Manasi Kulkarni",
      text: "AssuredJob.com guarantees job flow and candidate supply, making recruitment stress-free!",
      ac: "Kolhapur",
    },
    {
      id: 44,
      name: "Aakash Pandey",
      text: "I've built my entire career around freelance recruiting with their job security and consistent payouts.",
      ac: "Aligarh",
    },
    {
      id: 45,
      name: "Ritika Sood",
      text: "Their long-term contracts mean I always have hiring opportunities.",
      ac: "Gorakhpur",
    },
    {
      id: 46,
      name: "Suhas Rane",
      text: "Unlike other freelance job portals, their client base is strong and reliable!",
      ac: "Nagpur",
    },
    {
      id: 47,
      name: "Arti Sinha",
      text: "They offer continuous recruiter engagement, so I never feel out of work!",
      ac: "Dhanbad",
    },
    {
      id: 48,
      name: "Rohan Kapoor",
      text: "They ensure freelancers get real work, not just empty job postings!",
      ac: "Bhilai",
    },
    {
      id: 49,
      name: "Tanvi Dubey",
      text: "Finally, a trustworthy freelance recruiter network that delivers real results!",
      ac: "Anand",
    },
    {
      id: 50,
      name: "Sandeep Rawat",
      text: "FreelanceRecruiter.in is a game-changer for recruiter careers!",
      ac: "Ajmer",
    },
  ];

  const [screenSize, setScreenSize] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [scrollPositions, setScrollPositions] = useState({
    client: 0,
    student: 0,
    freelancer: 0,
  });
  const [isPaused, setIsPaused] = useState({
    client: false,
    student: false,
    freelancer: false,
  });
  const [speedRate, setSpeedRate] = useState({
    client: 1,
    student: 1,
    freelancer: 1,
  });

  const clientScrollRef = useRef(null);
  const studentScrollRef = useRef(null);
  const freelancerScrollRef = useRef(null);

  const clientCarouselRef = useRef(null);
  const studentCarouselRef = useRef(null);
  const freelancerCarouselRef = useRef(null);

  const sectionKeys = ["client", "student", "freelancer"];
  const scrollSpeed = 50;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("xs");
        setVisibleCount(1);
      } else if (width < 768) {
        setScreenSize("sm");
        setVisibleCount(2);
      } else if (width < 1024) {
        setScreenSize("md");
        setVisibleCount(3);
      } else {
        setScreenSize("lg");
        setVisibleCount(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const duplicateTestimonials = (testimonials) => {
    return [...testimonials, ...testimonials];
  };

  const duplicatedClientTestimonials =
    duplicateTestimonials(clientTestimonials);
  const duplicatedStudentTestimonials =
    duplicateTestimonials(studentTestimonials);
  const duplicatedFreelancerTestimonials = duplicateTestimonials(
    freelancerTestimonials
  );

  useEffect(() => {
    const animateScroll = (scrollRef, contentWidth, key) => {
      if (!scrollRef.current) return;

      let animationFrameId;

      const step = () => {
        if (isPaused[key]) {
          animationFrameId = requestAnimationFrame(step);
          return;
        }

        const pixelsToScroll = (scrollSpeed / 60) * speedRate[key];
        let newPosition = scrollPositions[key] + pixelsToScroll;

        if (newPosition >= contentWidth / 2) {
          newPosition = 0;
        }

        setScrollPositions((prev) => ({
          ...prev,
          [key]: newPosition,
        }));

        scrollRef.current.style.transform = `translateX(-${newPosition}px)`;

        animationFrameId = requestAnimationFrame(step);
      };

      animationFrameId = requestAnimationFrame(step);

      return () => cancelAnimationFrame(animationFrameId);
    };

    const cardWidth = 320 + 12; // card width + gap

    const clientCleanup = animateScroll(
      clientScrollRef,
      clientTestimonials.length * cardWidth,
      "client"
    );
    const studentCleanup = animateScroll(
      studentScrollRef,
      studentTestimonials.length * cardWidth,
      "student"
    );
    const freelancerCleanup = animateScroll(
      freelancerScrollRef,
      freelancerTestimonials.length * cardWidth,
      "freelancer"
    );

    return () => {
      clientCleanup && clientCleanup();
      studentCleanup && studentCleanup();
      freelancerCleanup && freelancerCleanup();
    };
  }, [
    clientTestimonials.length,
    studentTestimonials.length,
    freelancerTestimonials.length,
    scrollPositions,
    isPaused,
    speedRate,
  ]);

  const scrollTestimonials = (direction, scrollRef, sectionKey) => {
    if (!scrollRef.current) return;

    const currentPosition = scrollPositions[sectionKey];
    const scrollAmount = 320; // one card width
    let newPosition = currentPosition;

    if (direction === "right") {
      newPosition = Math.max(currentPosition - scrollAmount, 0);
    } else if (direction === "left") {
      newPosition = currentPosition + scrollAmount;
    }

    setScrollPositions((prev) => ({
      ...prev,
      [sectionKey]: newPosition,
    }));

    scrollRef.current.style.transition = "transform 0.5s ease-out";
    scrollRef.current.style.transform = `translateX(-${newPosition}px)`;

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.style.transition = "";
      }
    }, 500);
  };

  useEffect(() => {
    const setupInteractionHandlers = (carouselRef, key) => {
      if (!carouselRef.current) return;

      const handleStart = () => {
        setIsPaused((prev) => ({
          ...prev,
          [key]: true,
        }));
      };

      const handleEnd = () => {
        setIsPaused((prev) => ({
          ...prev,
          [key]: false,
        }));
      };

      carouselRef.current.addEventListener("mousedown", handleStart);
      carouselRef.current.addEventListener("touchstart", handleStart);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchend", handleEnd);

      return () => {
        if (carouselRef.current) {
          carouselRef.current.removeEventListener("mousedown", handleStart);
          carouselRef.current.removeEventListener("touchstart", handleStart);
        }
        window.removeEventListener("mouseup", handleEnd);
        window.removeEventListener("touchend", handleEnd);
      };
    };

    const clientCleanup = setupInteractionHandlers(clientCarouselRef, "client");
    const studentCleanup = setupInteractionHandlers(
      studentCarouselRef,
      "student"
    );
    const freelancerCleanup = setupInteractionHandlers(
      freelancerCarouselRef,
      "freelancer"
    );

    return () => {
      clientCleanup && clientCleanup();
      studentCleanup && studentCleanup();
      freelancerCleanup && freelancerCleanup();
    };
  }, []);

  const renderTestimonialCard = (data, index) => (
    <div
      key={index}
      className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between w-full mx-auto transition-all duration-300 hover:shadow-xl"
      style={{
        minWidth: "300px",
        width: "300px",
        margin: "0 6px",
        height: "220px",
      }}
    >
      <div className="mb-4">
        <p className="text-gray-600 text-sm line-clamp-5 text-start leading-relaxed">
          {data.text}
        </p>
      </div>

      <div className="flex items-center w-full mt-auto pt-2 border-t border-gray-100">
        <div className="flex-1 text-center">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold shrink-0">
              {data.name[0]}
            </span>
            <div className="flex flex-col items-start">
              <p className="text-base font-semibold text-gray-800 text-start">
                {data.name}
              </p>
              {data.ac && (
                <span className="text-xs text-purple-500 font-medium">
                  {data.ac}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScrollingSection = (
    testimonials,
    duplicatedTestimonials,
    scrollRef,
    carouselRef,
    title,
    sectionKey
  ) => (
    <div className="w-full max-w-8xl mx-auto my-10">
      <p className="text-purple-600 mb-4 text-xl font-medium">{title}</p>

      <div className="relative overflow-hidden" ref={carouselRef}>
        <button
          onClick={() => scrollTestimonials("right", scrollRef, sectionKey)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all hover:scale-105"
          aria-label="Previous testimonials"
        >
          <ChevronLeft className="w-6 h-6 text-purple-700" />
        </button>

        <div
          className="flex"
          ref={scrollRef}
          style={{
            willChange: "transform",
            transform: `translateX(-${scrollPositions[sectionKey] || 0}px)`,
          }}
        >
          {duplicatedTestimonials.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="transition-transform duration-300 ease-in-out hover:scale-105 mx-2"
              onMouseEnter={() =>
                setSpeedRate((prev) => ({ ...prev, [sectionKey]: 0.5 }))
              }
              onMouseLeave={() =>
                setSpeedRate((prev) => ({ ...prev, [sectionKey]: 1 }))
              }
            >
              {renderTestimonialCard(item, `${item.id}-${index}`)}
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollTestimonials("left", scrollRef, sectionKey)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all hover:scale-105"
          aria-label="Next testimonials"
        >
          <ChevronRight className="w-6 h-6 text-purple-700" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <EventsDisplay />
      <BlogDisplay />
      <NewsDisplay />

      <div className="bg-purple-50 py-16 text-center flex flex-col items-center px-4 md:px-12">
        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-4 py-1.5 rounded-full">
          TESTIMONIALS
        </span>
        <h1 className="text-4xl text-[#42307D] font-bold my-6">
          Don&apos;t just take our word for it
        </h1>
        {renderScrollingSection(
          clientTestimonials,
          duplicatedClientTestimonials,
          clientScrollRef,
          clientCarouselRef,
          "Read what our clients have to say",
          "client"
        )}
        {renderScrollingSection(
          studentTestimonials,
          duplicatedStudentTestimonials,
          studentScrollRef,
          studentCarouselRef,
          "See what our recently joined candidates have to say",
          "student"
        )}
        {renderScrollingSection(
          freelancerTestimonials,
          duplicatedFreelancerTestimonials,
          freelancerScrollRef,
          freelancerCarouselRef,
          "Read what our Freelance Recruiters have to say",
          "freelancer"
        )}
      </div>
      <Contact />
      <FAQAccordion />
      <Newslettr />
    </>
  );
};

export default Cont5;
