import bg from '../assets/products/image 58.png';

const ConstForm = () => {
  return (
    <>
      {/* Header Section */}
      <div className="bg-[#FEFEFE] py-12 text-center px-4">
        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
          CONTACT
        </span>
        <h1 className="text-4xl text-[#42307D] font-bold my-3">Request a Consultation</h1>
        <p className="text-purple-500 mt-4 text-lg">
          We are always open to meeting new and interesting folks who want to join us on this journey.
        </p>
      </div>

      {/* Contact Information Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-6 md:px-12 lg:px-20 py-10">
        {/* Image Section */}
        <div className="flex justify-center">
          <img src={bg} alt="Contact Graphic" className="rounded-lg w-full max-w-sm md:max-w-md lg:max-w-lg" />
        </div>

        {/* Form Section */}
        <div className="p-6 rounded-2xl bg-white  w-full" style={{boxShadow:"10px -10px  blue"}}>
          <form className="grid grid-cols-1 gap-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Esther Howard"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Contact Field */}
            <div>
              <label htmlFor="contact" className="block text-gray-700 font-medium">Contact</label>
              <input
                type="tel"
                id="contact"
                placeholder="(480) 555-0103"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                id="email"
                placeholder="tanya.hill@example.com"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* City Field */}
            <div>
              <label htmlFor="city" className="block text-gray-700 font-medium">City</label>
              <input
                type="text"
                id="city"
                placeholder="Austin"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Country Field */}
            <div>
              <label htmlFor="country" className="block text-gray-700 font-medium">Country</label>
              <input
                type="text"
                id="country"
                placeholder="Australia"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Enquire Field */}
            <div>
              <label htmlFor="enquire" className="block text-gray-700 font-medium">Enquire</label>
              <select
                id="enquire"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">---Select---</option>
              </select>
            </div>

            {/* Enquire Detail Field */}
            <div>
              <label htmlFor="enquireDetail" className="block text-gray-700 font-medium">Enquire Detail</label>
              <textarea
                id="enquireDetail"
                placeholder="Your requirement"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ConstForm;
