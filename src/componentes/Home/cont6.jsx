import { useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import groupImage from "../../assets/products/Avatar group.png";
import Cont6B from "./cont6-B";

const Cont6 = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What services does AssuredJob.com offer?",
      answer:
        "AssuredJob.com specializes in recruitment, HR support, RPOs, labour compliances, payroll services, staffing solutions, campus hirings, career counselling, internships, and article ships. We provide end-to-end hiring solutions for employers and career guidance for job seekers.",
    },
    {
      question: "How can I apply for jobs through AssuredJob.com?",
      answer:
        " Visit our Current Openings section, browse available positions, and submit your application. Our recruitment team will review your profile and contact you if you’re a fit.",
    },
    {
      question: "How can employers hire through AssuredJob.com?",
      answer:
        "Employers can partner with us for permanent recruitment, RPO services, temporary staffing, payroll outsourcing, and compliance management. Reach out via our Contact Us page or email hiring@assuredjob.com.",
    },
    {
      question: " Do you offer campus hiring services",
      answer:
        " Yes, we collaborate with colleges and universities to conduct campus recruitment drives, pre-placement training, and graduate hiring programs for fresher candidates.",
    },
    {
      question: "How can I become a freelance recruiter with AssuredJob.com?",
      answer:
        " If you have experience in recruitment and want to work on your own terms, apply through our Freelance Recruiter Sign-up Page to start earning commissions on successful placements. Alternatively, you can visit our website FreelanceRecruiter.in and apply as a Freelance Recruiter or Consultant. ",
    },
    {
      question: "What is RPO, and how does it benefit companies?",
      answer:
        " Recruitment Process Outsourcing (RPO) allows companies to outsource their hiring process to us, reducing hiring costs, improving efficiency, and streamlining workforce planning.",
    },
    {
      question: " Do you provide labour compliance services?",
      answer:
        " Yes, we assist companies with EPF, ESIC, payroll management, labour law compliances, and regulatory compliance support to ensure smooth HR operations.",
    },
    {
      question: " Can AssuredJob.com help with career counselling?",
      answer:
        "  Absolutely! We offer career counselling, resume building, LinkedIn profile optimization, interview preparation, and job market insights to help job seekers enhance their employability.",
    },
    {
      question: "Do you provide assistance for internships and articleships?",
      answer:
        "Yes, we connect students with internship and articleship opportunities across various industries to help them gain practical experience and improve job readiness.",
    },
    {
      question:
        "How can I stay updated with job openings and recruitment news?",
      answer:
        "Follow us on LinkedIn, Facebook, Twitter/X, and Instagram or visit our Current Openings page regularly. We also provide job alerts and newsletters for the latest hiring trends.",
    },
    {
      question: " How can I contact AssuredJob.com for further inquiries?",
      answer:
        "You can reach us via phone at +91 8860159136, email at hr@assuredjob.com, or through our Contact Us form. Our support team is available to assist you.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white text-center mt-4 p-6 lg:mx-20">
      <h1 className="text-3xl font-medium">Frequently Asked Questions</h1>
      <p className="text-sm text-gray-600">
        Everything you need to know about the product and billing.
      </p>

      <div className="mt-6 max-w-2xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b py-4 text-left">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <p className="font-medium text-gray-800">{faq.question}</p>
              {openIndex === index ? (
                <FaMinusCircle className="text-purple-600 text-xl transition-transform duration-300" />
              ) : (
                <FaPlusCircle className="text-gray-500 text-xl transition-transform duration-300" />
              )}
            </div>

            {openIndex === index && (
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center  mt-5">
        <img
          src={groupImage}
          alt="Responsive Image"
          className="max-w-full h-auto"
        />
      </div>
      <div className="text">
        <h1 className="text-2xl font-medium">Still have Question ?</h1>
        <p className="text-sm text-gray-600 mb-5">
          Can't find the answer you're looking for? Please chat to our friendly
          team.
        </p>
        <span className="w-full h-fit bg-purple-600 text-white rounded-lg  p-2 cursor-pointer ">
          Get in touch
        </span>
      </div>
    </div>
  );
};

export default Cont6;
