import ig1 from "../../assets/products/image 55.png";
import ig2 from "../../assets/products/image 56.png";
const Cont9 = () => {
  return (
    <>
      <div className="flex flex-col items-center px-4  w-full">
        <p className="text-center lg:text-xl font-semibold max-w-2xl mb-4 w-80 md:w-auto ">
          Sky Wings Advisors helps Indian businesses build stable, long-term
          workforces. Our permanent staffing solutions are designed to match
          candidates committed to long-term growth with your company's values
          and goals. We handle the entire recruitment.
        </p>

        

        <div className="flex flex-col items-center p-4  w-full">
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl ">
           
            <div className="w-full">
              <img
                src={ig1}
                alt="Volunteers"
                className="w-full h-auto rounded-lg"
              />
            </div>

           
            <div className="w-full flex justify-center">
              <img
                src={ig2}
                alt="Volunteer holding heart"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

         
          <div className=" max-w-xl mt-4">
            <img
              src={ig2}
              alt="Volunteer holding heart"
              className="w-120 h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Cont9;
