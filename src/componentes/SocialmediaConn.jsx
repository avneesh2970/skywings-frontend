import { FaWhatsapp, FaInstagram, FaLinkedin,   } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function SocialmediaConn() {
  return (
    <>
       <div className="   my-auto fixed z-50 right-1 top-1/2 transform -translate-y-1/2 grid  gap-5 hover:gap-5 transition-all duration-[1000ms]">


       <Link
  to="https://api.whatsapp.com/send?phone=918860159136&text=Hello%21+I+found+your+website+https%3A%2F%2Fwww.assuredjob.in+and+am+interested+in+your+products."
  target="_blank"
  rel="noopener noreferrer"
  className="text-green-500 rounded-lg text-3xl hover:scale-110 duration-300 hover:shadow-[0_0_20px_5px] hover:shadow-green-500/50"
>
  <FaWhatsapp className="w-9 h-9 text-green-500" />
</Link>


      <Link
        to="https://www.instagram.com/assuredjob/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-500 rounded-lg text-3xl hover:scale-110 duration-300 hover:shadow-[0_0_20px_5px] hover:shadow-red-500/50"
      >
        <FaInstagram  className='w-9 h-9'/>
      </Link>
      <Link
        to="https://www.linkedin.com/company/skywings-advisors-pvt-ltd/"
        target="_blank"
        rel="noopener noreferrer"
       className="text-blue-500 rounded-lg text-3xl hover:scale-110 duration-300 hover:shadow-[0_0_20px_5px] hover:shadow-blue-500/50"
      >
        <FaLinkedin className='w-9 h-9'/>
      </Link>
      <Link
        to="https://www.youtube.com/in/in/YOUR_PROFILE_NAME_HERE"
        target="_blank"
        rel="noopener noreferrer"
       className="text-red-500 rounded-lg  bg-transparent text-3xl hover:scale-110 duration-300 hover:shadow-[0_0_20px_5px] hover:shadow-red-500/50"
      >
        <FaYoutube className=' w-9 bg-transparent h-9'/>
      </Link>
      <Link
        to=""
        target="_blank"
        rel="noopener noreferrer"
       className="text-black rounded-lg  bg-transparent text-3xl hover:scale-110 duration-300 hover:shadow-[0_0_20px_5px] hover:shadow-black"
      >
        <FaXTwitter className=' w-9 bg-transparent h-9'/>
      </Link>
    </div>
    </>
  )
}

export default SocialmediaConn
