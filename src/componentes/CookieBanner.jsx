import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CookieBanner = () => {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="z-40 fixed bottom-0 left-0 right-0 bg-gray-200 text-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between">
      <p className="text-lg font-semibold py-10 text-gray-500 mx-10">
  <span className="text-gray-800 font-semibold">At AssuredJob.com</span>, we use cookies and similar tracking technologies to improve your browsing experience, analyze website traffic, and personalize content. This Cookie Policy explains what cookies are, how we use them, and how you can manage your preferences. By continuing to use our website, you consent to our use of cookies in accordance with this policy. 
  <a onClick={() => {navigate('/policy'), window.scrollTo(0,0)}} className="cursor-pointer underline text-blue-500 ">Privacy Policy</a>.
</p>

    <div className="flex flex-col gap-10">
    < button
        onClick={acceptCookies}
        className="w-28 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2 md:mt-0"
      >
        Accept
      </button>
      {/* <button
      
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2 md:mt-0"
      >
          Cookies Setting
      </button> */}
    </div>
    </div>
  );
};

export default CookieBanner;