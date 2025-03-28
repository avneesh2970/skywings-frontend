const Cont1A=()=>{
    const box = [
        { number: "10,000+", text: "Total placement" },
        { number: "1000+", text: "Active jobs" },
        { number: "100+", text: "Companies" },
        { number: "1,00,000+", text: "Registered Users" },
      ];
    return(
        <>
        <div className="bg-[#f5f5f5] py-8 flex justify-center ">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-4 lg:mx-10 mx-8 max-w-screen-xl ">
          {box.map((items, index) => (
            <div
              key={index}
              className="text-center px-3 py-6 bg-white shadow-md rounded-lg"
            >
              <p className="font-bold text-2xl text-[#647DE7]">
                {items.number}
              </p>
              <span>{items.text}</span>
            </div>
          ))}
        </div>

      </div>
        </>
    )
}
export default Cont1A