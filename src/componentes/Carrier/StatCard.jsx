
// eslint-disable-next-line react/prop-types
const StatCard = ({ count, platform }) => {
    return (
        <div className="flex flex-col items-center justify-center p-4 bg-[#F5F5F5] rounded-lg shadow-md w-32 sm:w-40 md:w-48">
            <p className="text-xl font-semibold text-[#232323]">{count}</p>
            <p className="text-[#383838] text-sm">{platform}</p>
        </div>
    );
};

export default StatCard;
