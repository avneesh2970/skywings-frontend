import img from '../../assets/carrier/herosectionimg.png'
import { ChevronRight } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-scroll';
const CareerHeroSection = () => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const handleopen = () => {
        setOpenDropdown(!openDropdown);
    }
    return (
        <>
            <section className="flex flex-col md:flex-row items-center justify-between mx-10 p-6 bg-white rounded-lg ">

                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-[#000000]">
                        Careers at AssuredJob.com
                    </h2>
                    <h2 className='text-2xl font-bold text-[#000000] mt-4'>Join a Team That’s Changing the Future of Recruitment</h2>
                    <p className="text-[#2B2B2B] mt-2 leading-6">
                        At <span className="font-semibold text-[#000000]">AssuredJob.com</span>,
                        we are on a mission to revolutionize staffing and recruitment by
                        connecting top talent with leading employers across industries.Whether you&apos;re an  executive, job-seeker, or industry professional , we offer exciting career opportunities that empower you to grow and
                        make a difference.
                    </p>

                  

                    <p className="mt-4 text-sm text-[#000000]">
                        Send your resume:{" "}
                        <a href="mailto:careers@assuredjob.com" className="font-semibold text-[#2B2B2B]">
                            careers@assuredjob.com
                        </a>
                    </p>
                    <div 
    onClick={handleopen} 
    className='flex px-10 w-72 font-semibold justify-between py-1 border border-purple-600 text-purple-600 rounded-md mt-4 cursor-pointer'
>
    <p>Join Now</p>
    <p>{openDropdown ? <ChevronDown size={24}/> :<ChevronRight size={24} />}</p>
</div>

<div 
    className={`flex w-72 flex-col transition-all duration-300 ease-in-out overflow-hidden ${
        openDropdown ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
    }`}
>
    <Link
    to="full_time" 
    spy={true} 
    smooth={true} 
    offset={-80} 
    duration={600}  
    className="px-4 mt-1.5 ml- bg-white py-2 justify-between flex cursor-pointer  rounded-md   border border-purple-600 text-purple-600  hover:bg-purple-200">
        <p>Join as a Full-Time Employee</p><ChevronRight size={24} />
    </Link>
    <button onClick={()=> window.open('https://www.freelancerecruiter.in/', '_blank')} className="px-4 bg-white justify-between flex py-2 cursor-pointer  border border-purple-600 text-purple-600  rounded-md hover:bg-purple-200">
    <p>Join as a Freelance Recruiter</p><ChevronRight size={24} />
        
    </button>
</div>

                    
                </div>

                <div className="md:w-1/2 flex justify-center">
                    <img
                        src={img}
                        alt="Career Illustration"
                        className="w-full max-w-sm"
                    />
                </div>
                
            </section>
        </>
    )
}

export default CareerHeroSection