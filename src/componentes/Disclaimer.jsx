const Disclaimer = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">
        Disclaimer
        </h1>

        <h2 className="text-xl font-semibold mt-6">General Information</h2>
        <p className="mt-2 text-gray-700">
          The information provided on <strong>AssuredJob.com</strong>{" "}
          (“Website”) is for general informational purposes only. While we
          strive to ensure accuracy, AssuredJob.com and its parent company,{" "}
          <strong>Skywings Advisors Private Limited</strong>, make no warranties
          regarding the completeness, reliability, or suitability of the
          Website’s information.
        </p>

        <h2 className="text-xl font-semibold mt-6">No Employment Guarantee</h2>
        <p className="mt-2 text-gray-700">
          AssuredJob.com is a staffing and recruitment platform connecting job
          seekers with employers. However, we do not guarantee job placements,
          interview calls, or employment opportunities. All hiring decisions are
          at the discretion of employers.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Third-Party Links & Services
        </h2>
        <p className="mt-2 text-gray-700">
          Our Website may contain links to third-party websites. We do not
          endorse or guarantee the accuracy or reliability of these third-party
          services. Users should conduct their own due diligence before engaging
          with external websites.
        </p>

        <h2 className="text-xl font-semibold mt-6">Limitation of Liability</h2>
        <p className="mt-2 text-gray-700">
          Under no circumstances shall AssuredJob.com, its affiliates,
          directors, employees, or agents be liable for any direct, indirect,
          incidental, or consequential damages resulting from the use of this
          Website.
        </p>

        <h2 className="text-xl font-semibold mt-6">User Responsibility</h2>
        <p className="mt-2 text-gray-700">
          Users are responsible for verifying job listings, employer
          credibility, and employment terms. AssuredJob.com is not liable for
          any misrepresentation, fraud, or misconduct by employers, recruiters,
          or job seekers.
        </p>

        <h2 className="text-xl font-semibold mt-6">Changes to Disclaimer</h2>
        <p className="mt-2 text-gray-700">
          We reserve the right to modify this Disclaimer at any time without
          prior notice. Users should review this page periodically for updates.
        </p>

        <h2 className="text-xl font-semibold mt-6">Contact Information</h2>
        <p className="mt-2 text-gray-700">
          If you have any questions, please contact us:
        </p>
        <p className="mt-1">
          <strong>Skywings Advisors Private Limited</strong>
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:hr@assuredjob.com"
            className="text-blue-600 hover:underline"
          >
            hr@assuredjob.com
          </a>
        </p>
        <p>
          Phone:{" "}
          <a href="tel:+918368002731" className="text-blue-600 hover:underline">
            8368002731
          </a>
        </p>
      </div>
    </>
  );
};

export default Disclaimer;
