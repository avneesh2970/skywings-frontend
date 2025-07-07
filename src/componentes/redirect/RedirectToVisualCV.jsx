import { useEffect } from "react";

function RedirectToVisualCV() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "https://visualcv.partnerlinks.io/gyn1e45wlxz0";
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Redirecting to VisualCV…
      </h2>

      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>

      <p className="text-gray-600">
        Please wait while we take you to the page.
      </p>
    </div>
  );
}

export default RedirectToVisualCV;
