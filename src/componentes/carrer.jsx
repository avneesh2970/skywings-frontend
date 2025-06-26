/* eslint-disable no-unused-vars */

import { Element } from "react-scroll";
import React, { useState } from "react";
import CareerHeroSection from "../componentes/Carrier/CareerHeroSection";
import Card from "../componentes/Carrier/Card";
import JobCard from "../componentes/Carrier/JobCard";
import SearchBar from "../componentes/Carrier/SearchBar";
import StatCard from "../componentes/Carrier/StatCard";
import FAQAccordion from "../componentes/Carrier/FAQAccordion";
import SupportSection from "../componentes/Carrier/SupportSection";
import Arrows from "../componentes/Carrier/Arrows";
import Cont2 from "./Home/cont2";
import img_ from "../assets/carr.png";
import linkedin from "../assets/linkedincarr.png";
import insta from "../assets/instacarr.png";
import what from "../assets/whatappcarr.png";
import CareerPageJobs from "./Home/CareerPageJobs";
import Resume from "./Carrier/Resume";

const cards = [
  {
    title: "Dynamic Work Culture",
    description: "We foster innovation, collaboration, and growth.",
  },
  {
    title: "Unlimited Earning Potential",
    description: "Competitive salaries, incentives, and commissions.",
  },
  {
    title: "Career Advancement",
    description: "Learning & development programs to help you upskill.",
  },
  {
    title: "Flexible Work Options",
    description: "Remote, hybrid, and in-office roles available.",
  },
  {
    title: "Industry-Leading Expertise",
    description: "Work with recruitment experts and top clients.",
  },
];

const scan = [
  {
    name: "linkedin",
    img: linkedin,
  },
  {
    name: "instagram",
    img: insta,
  },
  {
    name: "Whatsapp",
    img: what,
  },
];

const jobCards = [
  {
    title: "Senior Manager",
    location: "Bangalore",
    experience: "5 Years of experience",
  },
  {
    title: "Senior Manager",
    location: "Bangalore",
    experience: "5 Years of experience",
  },
  {
    title: "Senior Manager",
    location: "Bangalore",
    experience: "5 Years of experience",
  },
  {
    title: "Senior Manager",
    location: "Bangalore",
    experience: "5 Years of experience",
  },
  {
    title: "Senior Manager",
    location: "Bangalore",
    experience: "5 Years of experience",
  },
];

const platFormCard = [
  {
    count: "74",
    platform: "Instagram Followers",
    link: "https://www.instagram.com/assuredjob/ ",
  },
  {
    count: "561",
    platform: "Facebook Followers",
    link: "https://www.facebook.com/www.assuredjob.in?rdid=8Q0uNLYzpF0wXPUg&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F15Zrb6ooNt%2F#",
  },
  {
    count: "10K",
    platform: "Linkedin Followers",
    link: "https://www.linkedin.com/company/skywings-advisors-pvt-ltd/ ",
  },
  {
    count: "1",
    platform: "YouTube Subscribers",
    link: "https://www.youtube.com/@TheAssuredJobChannel ",
  },
];

const Career = () => {
  const [cardIndex, setCardIndex] = useState(0);
  const [jobIndex, setJobIndex] = useState(0);
  const [statIndex, setStatIndex] = useState(0);

  const nextCardSlide = () => setCardIndex((prev) => (prev + 1) % cards.length);
  const prevCardSlide = () =>
    setCardIndex((prev) => (prev - 1 + cards.length) % cards.length);

  const nextJobSlide = () =>
    setJobIndex((prev) => (prev + 1) % jobCards.length);
  const prevJobSlide = () =>
    setJobIndex((prev) => (prev - 1 + jobCards.length) % jobCards.length);

  const nextStatSlide = () =>
    setStatIndex((prev) => (prev + 1) % platFormCard.length);
  const prevStatSlide = () =>
    setStatIndex(
      (prev) => (prev - 1 + platFormCard.length) % platFormCard.length
    );

  return (
    <>
      <CareerHeroSection />

      <div className="flex flex-col items-center gap-5 py-15 bg-white">
        <h2 className="text-[#000000] text-2xl font-[500]">
          Why Work with Us?
        </h2>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-center bg-white border-2 border-blue-600 rounded-2xl p-6 transition-all duration-700 ease-in-out transform animate-[flip-glow_0.8s_ease-out_forwards] hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-700 hover:to-blue-900 hover:text-white focus Outline-none focus:ring-4 focus:ring-blue-300"
                style={{ animationDelay: `${index * 0.12}s` }}
                role="article"
                aria-labelledby={`card-title-${index}`}
                tabIndex={0}
              >
                <h3
                  id={`card-title-${index}`}
                  className="font-bold text-center text-xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:text-white"
                >
                  {card.title}
                </h3>
                <p className="text-center text-sm opacity-90 group-hover:opacity-100 group-hover:text-white">
                  {card.description}
                </p>
                <div className="absolute inset-0 rounded-2xl bg-blue-500 opacity-0 group-hover:opacity-20 group-hover:animate-[pulse-glow_1.5s_ease-in-out_infinite] transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        <Element name="full_time">
          <div className="flex justify-between w-full px-7">
            <p className="font-semibold">Open Position (10)</p>
            <p className="my-8">Send Your Resume : careers@assuredjob.com</p>
          </div>
          <CareerPageJobs className="z-40" />
        </Element>
        <div className="md:hidden w-full flex flex-col items-center relative overflow-hidden my-3">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${cardIndex * 100}%)`,
              width: "100%",
            }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 flex justify-center"
              >
                <Card title={card.title} description={card.description} />
              </div>
            ))}
          </div>
          <Arrows nextSlide={nextCardSlide} prevSlide={prevCardSlide} />
        </div>
        <div className="flex w-full flex-col">
          <span className="bg-purple-200 w-20  w-28 flex justify-center mx-auto text-purple-700 text-xs lg:text-base font-semibold px-3 py-1  mt-10 rounded-full">
            Scan code
          </span>
          <div className="w-full bg-white-200 py-4 px-4">
            <div className="grid w-full justify-center mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-12 py-10">
              {scan.map((list, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-white shadow-lg rounded-lg pt-5 bounce-on-hover"
                >
                  <p className="text-center text-lg font-semibold text-gray-800">
                    Contact us on {list.name}
                  </p>

                  <div className="flex z-10 justify-center mt-2">
                    <img
                      src={img_}
                      className="h-36 w-36 rounded-full object-cover"
                      alt="Profile"
                    />
                  </div>

                  {/* Information Box */}
                  <div className="bg-gray-100 -mt-24 sm:-mt-28 p-4 w-full rounded-lg shadow-sm text-center space-y-2">
                    <p className="text-lg font-semibold text-gray-900 pt-14 md:pt-16">
                      Skywings
                    </p>
                    <p className="text-sm text-gray-600">
                      Assure you a better tomorrow
                    </p>

                    {/* LinkedIn Logo */}
                    <div className="flex justify-center mt-4">
                      <img
                        src={list.img}
                        alt="LinkedIn Logo"
                        className="h-32 w-32 sm:h-24 sm:w-24 md:h-40 md:w-40"
                      />
                    </div>
                    <p className="text-center text-sm font-medium text-gray-700">
                      Scan Code
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <style jsx>{`
            /* Bounce animation */
            .bounce-on-hover {
              transition: transform 0.4s ease;
            }

            .bounce-on-hover:hover {
              animation: bounce 0.5s ease; /* remove 'infinite' */
            }

            @keyframes bounce {
              0%,
              20%,
              50%,
              80%,
              100% {
                transform: translateY(0);
              }
              40% {
                transform: translateY(-10px);
              }
              60% {
                transform: translateY(-5px);
              }
            }
          `}</style>
        </div>
      </div>

      <Resume />
      <h3 className="text-center text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-700 mb-8 sm:mb-12 max-w-2xl mx-auto mt-14 leading-snug sm:leading-tight">
        Join 100K+ professionals who trust AssuredJob for career growth.
      </h3>

      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
            Our Social Media Presence
          </h2>

          <div className="flex justify-center w-full px-4 mb-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl w-full place-items-center">
              {platFormCard.map((info, index) => (
                <a
                  key={index}
                  href={info.link.trim() !== "" ? info.link : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <StatCard count={info.count} platform={info.platform} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* <div className="md:hidden w-full flex flex-col items-center relative overflow-hidden my-3">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${statIndex * 100}%)`,
            width: "100%",
          }}
        >
          {platFormCard.map((data, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 flex justify-center"
            >
              <StatCard count={data.count} platform={data.platform} />
            </div>
          ))}
        </div>
        <Arrows nextSlide={nextStatSlide} prevSlide={prevStatSlide} />
      </div> */}

      <FAQAccordion />
      <SupportSection />
    </>
  );
};

export default Career;
