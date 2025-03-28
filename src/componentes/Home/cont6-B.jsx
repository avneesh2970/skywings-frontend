const Cont6B = () => {
  return (
    <>
      <div className="mt-8 bg-blue-600 rounded-2xl relative p-4 md:p-8 lg:mx-20 mb-10 w-75 md:w-auto lg:w-auto mx-auto md:mx-10 ">
        <h1 className="font-medium lg:text-4xl text-xl text-white absolute left-1/2 transform -translate-x-1/2 ">
          Subscribe to Our Newsletter
        </h1>
        <div className="mt-24 flex flex-wrap justify-center gap-x-5  space-y-4">
          <input
            type="text"
            placeholder="First Name"
            className="text-white lg:w-75 md:w-90 w-full border border-white outline-none rounded p-2"
          />
          <input
            type="email"
            placeholder="Email address"
            className="text-white lg:w-75 md:w-90 w-full border border-white outline-none rounded p-2"
          />
          <button className="w-full h-fit lg:w-50 md:w-90 bg-black text-white rounded  p-2 cursor-pointer">
            Subscribe Now
          </button>
        </div>
      </div>
    </>
  );
};
export default Cont6B;
