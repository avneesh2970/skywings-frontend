const Cont1A = () => {
  const box = [
    { number: "10,000+", text: "Total placement" },
    { number: "1000+", text: "Active jobs" },
    { number: "100+", text: "Companies" },
    { number: "1,00,000+", text: "Registered Users" },
  ]

  return (
    <section className="bg-[#f5f5f5] py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {box.map((item, index) => (
            <div
              key={index}
              className="text-center px-4 py-6 sm:py-8 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
            >
              <p className="font-bold text-xl sm:text-2xl md:text-3xl text-[#647DE7] mb-2">{item.number}</p>
              <span className="text-sm sm:text-base text-gray-700">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Cont1A
