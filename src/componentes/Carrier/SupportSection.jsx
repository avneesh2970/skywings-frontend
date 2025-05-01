import img1 from "../../assets/carrier/img1.png";
import img2 from "../../assets/carrier/img2.png";
import img3 from "../../assets/carrier/img3.png";
import { useNavigate } from "react-router-dom";

const SupportSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center my-6 bg-[#F9FAFB] p-6 sm:p-10 rounded-2xl max-w-4xl mx-auto shadow-lg transition-all duration-300">
      <div className="flex -space-x-3 sm:-space-x-4 mb-6">
        <img
          className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-white shadow-md transition-transform duration-300 hover:scale-110"
          src={img1}
          alt="User 1"
        />
        <img
          className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-white shadow-md transition-transform duration-300 hover:scale-110"
          src={img2}
          alt="User 2"
        />
        <img
          className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-white shadow-md transition-transform duration-300 hover:scale-110"
          src={img3}
          alt="User 3"
        />
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-[#101828] mb-3 text-center">
        Still have questions?
      </h3>
      <div className="flex flex-col items-center">
        <p className="text-[#667085] text-sm sm:text-base text-center max-w-lg mb-6 leading-relaxed">
          Can't find the answer you're looking for? Our friendly team is here to
          help.
        </p>
        <button
          onClick={() => {
            navigate("/contact");
            window.scrollTo(0, 0);
          }}
          className="px-6 py-2 sm:px-8 sm:py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 border border-blue-500 hover:border-blue-600 transition-colors duration-300 w-full sm:w-auto min-w-[150px]"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default SupportSection;
