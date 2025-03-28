import { FaTwitter, FaLinkedin, FaDribbble } from "react-icons/fa";
import img1 from "../../assets/products/team1.png";
import img2 from "../../assets/products/team2.png";
import img3 from "../../assets/products/team3.png";
import img4 from "../../assets/products/team4.png";
import img5 from "../../assets/products/team5.png";
import img6 from "../../assets/products/team6.png";
import img7 from "../../assets/products/team7.png";
import img8 from "../../assets/products/team8.png";
const Cont8 = () => {
  const teamMembers = [
    {
      name: "Olivia Rhye",
      role: "Founder & CEO",
      image: img1,
      description:
        "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.",
    },
    {
      name: "Phoenix Baker",
      role: "Engineering Manager",
      image: img2,
      description: "Lead engineering teams at Figma, Pitch, and Protocol Labs.",
    },
    {
      name: "Lana Steiner",
      role: "Product Manager",
      image: img3,
      description: "Former PM for Linear, Lambda School, and On Deck.",
    },
    {
      name: "Demi Wilkinson",
      role: "Frontend Developer",
      image: img4,
      description: "Former frontend dev for Linear, Coinbase, and Postscript.",
    },
    {
      name: "Candice Wu",
      role: "Backend Developer",
      image: img5,
      description: "Lead backend dev at Clearbit. Former Clearbit and Loom.",
    },
    {
      name: "Natali Craig",
      role: "Product Designer",
      image: img6,
      description:
        "Founding design team at Figma. Former Pleo, Stripe, and Tile.",
    },
    {
      name: "Drew Cano",
      role: "UX Researcher",
      image: img7,
      description:
        "Lead user research for Slack. Contractor for Netflix and Udacity.",
    },
    {
      name: "Orlando Diggs",
      role: "Customer Success",
      image: img8,
      description: "Lead CX at Wealthsimple. Former PagerDuty and Sqreen.",
    },
  ];
  return (
    <>
      <div className="bg-white w-full py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 ">Meet our team</h2>
          <p className="mt-4 text-gray-600">
            Our philosophy is simple — hire a team of diverse, passionate people
            and foster a culture that empowers you to do your best work.
          </p>
        </div>

        <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  mt-12    w-full">
          {teamMembers.map((member, index) => (
            <div key={index} className="rounded-lg p-4 flex flex-col ">
              <img
                src={member.image}
                alt={member.name}
                className="w-70 h-70 object-cover rounded- mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mt-2">
                {member.name}
              </h3>
              <p className="text-purple-400 font-medium">{member.role}</p>
              <p className="text-gray-500 text-sm mt-2">{member.description}</p>
              <div className="flex space-x-4 mt-3 text-gray-400">
                <FaTwitter className="hover:text-purple-600 cursor-pointer" />
                <FaLinkedin className="hover:text-purple-600 cursor-pointer" />
                <FaDribbble className="hover:text-purple-600 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Cont8;

{
  /*import React from 'react';
import { FaTwitter, FaLinkedin, FaDribbble } from "react-icons/fa";
import img1 from "../assets/team1.png";
import img2 from "../assets/team8.png";
import img3 from "../assets/team2.png";
import img4 from "../assets/team7.png";
import img5 from "../assets/team6.png";
import img6 from "../assets/team5.png";
import img7 from "../assets/team4.png";
import img8 from "../assets/team3.png";

const teamMembers = [
  { name: "Olivia Rhye", role: "Founder & CEO", image: img1, description: "Former co-founder of Opendoor. Early staff at Spotify and Clearbit." },
  { name: "Phoenix Baker", role: "Engineering Manager", image: img2, description: "Lead engineering teams at Figma, Pitch, and Protocol Labs." },
  { name: "Lana Steiner", role: "Product Manager", image: img3, description: "Former PM for Linear, Lambda School, and On Deck." },
  { name: "Demi Wilkinson", role: "Frontend Developer", image: img4, description: "Former frontend dev for Linear, Coinbase, and Postscript." },
  { name: "Candice Wu", role: "Backend Developer", image: img5, description: "Lead backend dev at Clearbit. Former Clearbit and Loom." },
  { name: "Natali Craig", role: "Product Designer", image: img6, description: "Founding design team at Figma. Former Pleo, Stripe, and Tile." },
  { name: "Drew Cano", role: "UX Researcher", image: img7, description: "Lead user research for Slack. Contractor for Netflix and Udacity." },
  { name: "Orlando Diggs", role: "Customer Success", image: img8, description: "Lead CX at Wealthsimple. Former PagerDuty and Sqreen." },
];

const Aboutteam = () => {
  return (
    <div className="bg-white w-full py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900">Meet our team</h2>
        <p className="mt-4 text-gray-600">
          Our philosophy is simple — hire a team of diverse, passionate people  
          and foster a culture that empowers you to do your best work.
        </p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  mt-12 max-w-6xl mx-auto">
        {teamMembers.map((member, index) => (
          <div key={index} className="rounded-lg p-4 flex flex-col ">
            <img src={member.image} alt={member.name} className="w-70 h-70 object-cover rounded- mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mt-2">{member.name}</h3>
            <p className="text-purple-400 font-medium">{member.role}</p>
            <p className="text-gray-500 text-sm mt-2">{member.description}</p>
            <div className="flex space-x-4 mt-3 text-gray-500">
              <FaTwitter className="hover:text-purple-600 cursor-pointer" />
              <FaLinkedin className="hover:text-purple-600 cursor-pointer" />
              <FaDribbble className="hover:text-purple-600 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Aboutteam; */
}
