// eslint-disable-next-line react/prop-types
const StatCard = ({ count, platform }) => {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-[300px] sm:max-w-[220px] text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <h4 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{count}</h4>
        <p className="text-base sm:text-lg text-gray-600">{platform}</p>
      </div>
    );
  };
  
  export default StatCard;