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
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-purple-200 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">ABOUT</span>
        </motion.div>

        {/* FIRST GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold mb-4"
            >
              Assured Job started as a simple idea: to make job searching stress-free and recruitment faster.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-600 mb-4"
            >
              Skywings Advisors Private Limited, headquartered in New Delhi, is a leading force in the placement and
              recruitment industry. Our expertise spans across diverse recruitment disciplines, including Legal,
              Finance, IT, Sales & Marketing, Healthcare, Automobile, Training & Education, Industrial & Warehouse,
              Construction, E-Commerce, and more. We are committed to understanding your business as deeply as you
              do—tailoring our services to align perfectly with your goals. Building that connection is paramount,
              allowing us to bring both comprehensive recruitment knowledge and cutting-edge assessment methods to the
              table.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center"
          >
            <img
              src={img19 || "/placeholder.svg?height=400&width=500&query=interview"}
              alt="Interview Illustration"
              className="w-full max-w-md rounded-lg"
            />
          </motion.div>
        </div>

        {/* SECOND GRID SECTION (MISSION) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center items-center order-2 md:order-1"
          >
            <img
              src={img20 || "/placeholder.svg?height=400&width=500&query=work balance"}
              alt="Work Balance Illustration"
              className="w-full max-w-md rounded-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center order-1 md:order-2"
          >
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl md:text-2xl font-semibold mb-4"
            >
              Our Mission
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-600 mb-4"
            >
              The world of job hunting and hiring can feel overwhelming. We&apos;re here to change that. Whether
              you&apos;re just starting your career or looking for your next big break, Assured Job simplifies the
              process.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="list-disc list-inside text-gray-600 space-y-2"
            >
              <li>To empower job seekers by connecting them with roles that fit their ambitions.</li>
              <li>To assist employers in finding top-tier talent, faster.</li>
            </motion.ul>
          </motion.div>
        </div>

        {/* THIRD GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl md:text-3xl font-bold mb-4"
            >
              Skywings Advisors Private Limited: Now ISO Certified!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-600 mb-4"
            >
              We are proud to announce that Skywings Advisors Private Limited has officially achieved ISO Certification,
              marking a significant milestone in our commitment to excellence. This certification reflects our
              dedication to maintaining the highest standards in recruitment, placement, and HR solutions across
              multiple industries.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="list-disc pl-5 space-y-2 text-gray-600"
            >
              <li>Quality-Driven Recruitment Services</li>
              <li>Enhanced Client & Candidate Satisfaction</li>
              <li>Efficient and Transparent Processes</li>
              <li>Compliance with International Standards</li>
            </motion.ul>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-600 mt-2"
            >
              Our ISO Certification is a testament to our unwavering focus on professionalism, reliability, and
              continuous improvement. Whether in Legal, Finance, IT, Healthcare, Sales & Marketing, Automobile,
              Education, E-Commerce, or other sectors, we ensure best-in-class hiring solutions tailored to your
              business needs.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center items-center"
          >
            <img
              src={img21 || "/placeholder.svg?height=400&width=500&query=ISO certification"}
              alt="ISO Certification"
              className="w-full max-w-md rounded-lg"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cont7
