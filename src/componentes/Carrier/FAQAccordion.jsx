import { useState } from "react";
import min from "../../../src/assets/carrier/mineus.png";
import add from "../../../src/assets/carrier/addicon.png";
import { useNavigate } from "react-router-dom";
const faqs = [
  {
    question: "How can I apply for jobs through AssuredJob.com?",
    answer: "You can apply by creating an account and uploading your resume.",
  },
  {
    question: "How can employers hire through AssuredJob.com?",
    answer: "Employers can post job openings and review candidate profiles.",
  },
  {
    question: "Do you offer campus hiring services?",
    answer: "Yes, we provide campus hiring solutions for fresh graduates.",
  },
  {
    question: "What industries do you specialize in for recruitment?",
    answer: "We specialize in IT, Healthcare, Finance, and more.",
  },
  {
    question: "Can AssuredJob.com help with career counselling?",
    answer: "Yes, we offer career guidance for job seekers.",
  },
  {
    question: "What is RPO, and how does it benefit companies?",
    answer:
      "RPO stands for Recruitment Process Outsourcing. It allows companies to outsource all or part of their recruitment process to us, ensuring faster hiring, better quality candidates, and reduced hiring costs.",
  },
  {
    question: "Do you provide labour compliance services?",
    answer:
      "Yes, we offer end-to-end labour law compliance services including payroll management, statutory registrations, returns filing, and audit assistance for organizations.",
  },
  {
    question: "Do you assist with bulk or contract staffing?",
    answer:
      "Absolutely. We provide bulk hiring solutions and contract staffing services to help businesses scale their workforce efficiently as per project or seasonal demands.",
  },
  {
    question: "How can I stay updated with job openings and recruitment news?",
    answer:
      "You can subscribe to our newsletter, follow us on social media, and regularly check the 'Latest Jobs' and 'Career Resources' sections on our website.",
  },
];

const FAQAccordion = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto px-10 my-5">
      <h2 className="text-[#101828] text-center text-2xl mt-4">
        Frequently asked questions
      </h2>
      <p className="text-[#667085] text-center mb-4">
        Everything you need to know about the product and billing.
      </p>
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-gray-300">
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full flex justify-between items-center py-4 text-left text-lg font-medium text-[#101828] transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {faq.question}
            {openIndex === index ? (
              <img
                className="cursor-pointer w-[20px] h-auto transform transition-transform duration-300 rotate-180"
                src={min}
                alt="Not-show"
              />
            ) : (
              <img
                className="cursor-pointer w-[20px] h-auto transform transition-transform duration-300 rotate-0"
                src={add}
                alt="Show-icon"
              />
            )}
          </button>
          <div
            className={`transition-all duration-500 ease-in-out max-h-0 overflow-hidden ${
              openIndex === index ? "max-h-[200px]" : ""
            }`}
          >
            {openIndex === index && (
              <p className="text-[#667085] pb-4">{faq.answer}</p>
            )}
          </div>
        </div>
      ))}
      <button
        onClick={() => navigate("/faq")}
        className="flex justify-center mx-auto mt-1.5 px-10 py-1 rounded-lg border border-blue-500 text-lg font-medium text-blue-500 cursor-pointer"
      >
        See more ...
      </button>
    </div>
  );
};

export default FAQAccordion;
