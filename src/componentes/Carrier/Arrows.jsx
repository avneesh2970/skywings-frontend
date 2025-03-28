/* eslint-disable react/prop-types */

const Arrows = ({ prevSlide, nextSlide }) => {
    return (
        <div className="md:hidden flex justify-center w-full px-5 mt-4 gap-4">
            <button
                className="px-4 py-2 bg-gray-300 text-black rounded-md cursor-pointer"
                onClick={prevSlide}>
                Left
            </button>
            <button
                onClick={nextSlide}
                className="px-4 py-2 bg-[#42307D] text-white rounded-md cursor-pointer">
                Right
            </button>
        </div>
    )
}

export default Arrows