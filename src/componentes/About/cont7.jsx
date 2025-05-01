"use client"

import img19 from "../../assets/products/image 19.png"
import img20 from "../../assets/products/image 20.png"
import img21 from "../../assets/iso3.png"
import { motion } from "framer-motion"

const Cont7 = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-screen w-full overflow-hidden">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* ABOUT TAG */}
        <motion.div
          className="text-center mb-6 md:mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-purple-200 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">ABOUT</span>
        </motion.div>

        {/* FIRST GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16 overflow-hidden">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Assured Job started as a simple idea: to make job searching stress-free and recruitment faster.
            </h2>
            <p className="text-gray-600 mb-4">
              Skywings Advisors Private Limited, headquartered in New Delhi, is a leading force in the placement and
              recruitment industry. Our expertise spans across diverse recruitment disciplines, including Legal,
              Finance, IT, Sales & Marketing, Healthcare, Automobile, Training & Education, Industrial & Warehouse,
              Construction, E-Commerce, and more. We are committed to understanding your business as deeply as you
              do—tailoring our services to align perfectly with your goals. Building that connection is paramount,
              allowing us to bring both comprehensive recruitment knowledge and cutting-edge assessment methods to the
              table.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center"
          >
            <img
              src={img19 || "/placeholder.svg?height=400&width=500&query=interview"}
              alt="Interview Illustration"
              className="w-full max-w-md rounded-lg shadow-md"
            />
          </motion.div>
        </div>

        {/* SECOND GRID SECTION (MISSION) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16 overflow-hidden">
          <motion.div
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center order-2 md:order-1"
          >
            <img
              src={img20 || "/placeholder.svg?height=400&width=500&query=work balance"}
              alt="Work Balance Illustration"
              className="w-full max-w-md rounded-lg shadow-md"
            />
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center order-1 md:order-2"
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Our Mission</h3>
            <p className="text-gray-600 mb-4">
              The world of job hunting and hiring can feel overwhelming. We&apos;re here to change that. Whether
              you&apos;re just starting your career or looking for your next big break, Assured Job simplifies the
              process.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>To empower job seekers by connecting them with roles that fit their ambitions.</li>
              <li>To assist employers in finding top-tier talent, faster.</li>
            </ul>
          </motion.div>
        </div>

        {/* THIRD GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 overflow-hidden">
          <motion.div
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Skywings Advisors Private Limited: Now ISO Certified!
            </h2>
            <p className="text-gray-600 mb-4">
              We are proud to announce that Skywings Advisors Private Limited has officially achieved ISO Certification,
              marking a significant milestone in our commitment to excellence. This certification reflects our
              dedication to maintaining the highest standards in recruitment, placement, and HR solutions across
              multiple industries.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Quality-Driven Recruitment Services</li>
              <li>Enhanced Client & Candidate Satisfaction</li>
              <li>Efficient and Transparent Processes</li>
              <li>Compliance with International Standards</li>
            </ul>
            <p className="text-gray-600 mt-2">
              Our ISO Certification is a testament to our unwavering focus on professionalism, reliability, and
              continuous improvement. Whether in Legal, Finance, IT, Healthcare, Sales & Marketing, Automobile,
              Education, E-Commerce, or other sectors, we ensure best-in-class hiring solutions tailored to your
              business needs.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex justify-center items-center"
          >
            <img
              src={img21 || "/placeholder.svg?height=400&width=500&query=ISO certification"}
              alt="ISO Certification"
              className="w-full max-w-md rounded-lg shadow-md"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cont7
