/* eslint-disable react/prop-types */

const JobCard = ({title,location,experience}) => {
    return (
        <div className="bg-[#F7F7F7] mx-10 shadow-md rounded-lg p-4 w-full max-w-xs">
            <h3 className="text-lg font-semibold text-[#000000]">{title}</h3>
            <div className="flex items-center gap-2 text-[#707070] text-sm mt-2">
                <span>📍 {location}</span>
            </div>
            <div className="flex items-center gap-2 text-[#707070] text-sm mt-1">
                <span>💼 {experience}</span>
            </div>
            <button className="mt-4 w-full border-2 border-[#7F56D9] text-[#7F56D9] py-2 rounded-lg font-medium hover:bg-purple-100 cursor-pointer">
                View Details
            </button>
        </div>
    )
}

export default JobCard;