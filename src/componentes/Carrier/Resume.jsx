import React from 'react'
import img from '../../assets/resume.jpg'
import { Play } from 'lucide-react';
function Resume() {
  return (
   <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${img})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-zinc-700/50 backdrop-blur-[1px]" ></div>

      {/* Content */}
      <div className="relative flex items-center pl-8 h-full">
        <h3 className="text-3xl font-semibold px-2 py-1 text-white bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 -mt-10">
          Create a perfect resume <span className="ml-2 ">In just 5 min</span>
          <p className='text-zinc-300 pt-4 text-lg w-6/12'>Hotel receptionist answering the phone.create a perfect resume in 5 minutes. getting the right set of information on resume increases the chances of selection very much</p>
          <button>
            <div className='gap-3.5 mt-14 text-base text-white items-center bg-blue-500 px-4 py-1 rounded-lg flex cursor-pointer' onClick={() => window.open('https://visualcv.partnerlinks.io/gyn1e45wlxz0', '_blank')} >
            {<Play className='w-8 h-8 p-2 border  rounded-full border-white e' />}
            <p>Play the video</p>
            </div>
          </button>
        </h3>
      </div>
    </div>
  
  )
}

export default Resume
