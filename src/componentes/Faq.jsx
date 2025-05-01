import React, { useState } from "react";
import min from "../assets/carrier/mineus.png";
import add from "../assets/carrier/addicon.png";

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faq = [
    {
      question: "Is the job Work From Home (WFH) or Work From Office (WFO)?",
      answer:
        "The job type varies depending on the employers requirements. We offer Work From Home (WFH), Work From Office (WFO), and Hybrid opportunities. You can check job descriptions for specific details.",
    },
    {
      question: "What will be the salary range for executive-level employees?",
      answer:
        "The salary for executive-level employees depends on industry standards, experience, and job role. Generally, executive salaries range between ₹2.5 LPA to ₹10 LPA, but it varies based on the company and location.",
    },
    {
      question: "Is there any option for job location change or relocation?",
      answer:
        "Some companies provide relocation assistance, while others may have fixed locations. If relocation options are available, they will be mentioned in the job posting.",
    },
    {
      question: "Are jobs available for PAN India or not?",
      answer:
        "Yes, we provide job opportunities across PAN India in various industries, including IT, healthcare, BFSI, retail, manufacturing, and more. ",
    },
    {
      question:
        "How can I connect to get the services of Skywings as a client?",
      answer:
        "You can connect with us by :Filling out the inquiry form on our website, Emailing us, Calling our support team ",
    },
    {
      question: "Do you provide payroll services?",
      answer:
        "Yes, we offer end-to-end payroll management services, including salary processing, tax compliance, PF/ESIC deductions, and statutory compliance.",
    },
    {
      question: "Do you provide legal advisory services also?",
      answer:
        "Yes, we offer legal advisory services related to labor laws, employment contracts, tax compliance, and HR policies.",
    },
    {
      question: "Can you help us with PF and ESIC registration?",
      answer:
        "Yes, we provide PF (Provident Fund) and ESIC (Employee State Insurance Corporation) registration and compliance services for businesses.",
    },
    {
      question: "How can I apply as a sub-vendor to work with your company?",
      answer:
        "If you're interested in partnering with us as a sub-vendor, please: Submit your details through our vendor registration form on the website FreelanceRecruiter.in, email your company profile, or call our partnership team.",
    },
    {
      question:
        "Where can I submit my resume to apply for jobs available with you?",
      answer:
        'You can submit your resume through the "Upload Your Resume" option or by applying for any relevant job on our website.',
    },
    {
      question:
        "How can I get new job notifications? Is there a sign-up page for that?",
      answer:
        "Yes, you can sign up for job alerts by: Registering on our website and subscribing to notifications, following our LinkedIn page and other social media channels, or joining our WhatsApp or Telegram job update groups.",
    },
    {
      question: "Do you provide jobs in Maharashtra and Telangana?",
      answer:
        "Yes, we have a strong presence in Maharashtra and Telangana, offering jobs in Bangalore, Pune, Mumbai, Hyderabad, and other major cities across various industries.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-10 my-8 bg-white rounded-2xl shadow-md">
      <h2 className="text-[#101828] text-center text-2xl sm:text-3xl font-bold mt-6">
        Frequently Asked Questions
      </h2>
      <p className="text-[#667085] text-center text-sm sm:text-base mb-6">
        Everything you need to know about our services.
      </p>
      {faq.map((faq, index) => (
        <div key={index} className="border-b border-gray-300">
          <button
            onClick={() => toggleFAQ(index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
            className="w-full flex justify-between items-center py-4 text-left text-base sm:text-lg font-medium text-[#101828] transition-all duration-300 hover:scale-[1.02] focus:outline-none"
          >
            <span>{faq.question}</span>
            <img
              className={`w-5 sm:w-6 h-auto transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}
              src={openIndex === index ? min : add}
              alt={openIndex === index ? "Collapse FAQ" : "Expand FAQ"}
            />
          </button>
          <div
            id={`faq-answer-${index}`}
            className={`transition-all duration-500 ease-in-out max-h-0 overflow-y-auto ${openIndex === index ? 'max-h-full py-2' : ''}`}
          >
            {openIndex === index && (
              <p className="text-[#667085] text-sm sm:text-base pb-4">{faq.answer}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Faq;