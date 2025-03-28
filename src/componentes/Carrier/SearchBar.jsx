
const SearchBar = () => {
    return (
        <div className="flex items-center bg-[#FFFFFF] shadow-md rounded w-full mx-auto p-1 my-5">
            <div className="flex items-center flex-1 px-4">
                <span className="text-[#A9ADB2]">🔍</span>
                <input
                    type="text"
                    placeholder="Search by job or skills"
                    className="w-full p-2 outline-none bg-transparent text-[#767678]"
                />
            </div>

            <div className="h-6 w-[1px] bg-[#A9ADB2]"></div>

            <div className="flex items-center flex-1 px-4">
                <span className="text-[#767678]">📍</span>
                <input
                    type="text"
                    placeholder="Location"
                    className="w-full p-2 outline-none bg-transparent text-[#767678]"
                />
            </div>

            <button className="bg-[#647DE7] text-[#FFFFFF] cursor-pointer px-6 py-2 rounded hover:bg-blue-700 transition">
                Search
            </button>
        </div>
    )
}

export default SearchBar;