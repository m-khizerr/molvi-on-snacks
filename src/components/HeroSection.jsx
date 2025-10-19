"use client";

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-[5vw] py-[8vh] h-[100vh]">
      <div className="max-w-[60vw] space-y-[2vh]">
        <p className="text-orange-500 font-semibold text-[2vh] md:text-[1.5vw]">
          Since 1987
        </p>
        <h1 className="text-gray-800 font-extrabold text-[5vh] md:text-[4vw] leading-[6vh] md:leading-[4.5vw]">
          Eat Our Grilled Potato Chips
        </h1>
        <p className="text-gray-600 text-[2vh] md:text-[1.2vw] leading-[3vh] md:leading-[2vw]">
          Enjoy crispy, flavorful, and perfectly grilled potato chips made with love and care.
        </p>
        <div className="flex gap-[2vw]">
          <button className="bg-green-600 text-white px-[3vw] py-[2vh] rounded-[5vw] hover:bg-green-700 transition-all text-[2vh] md:text-[1vw]">
            Discover More
          </button>
          <button className="border-[0.3vh] border-green-600 text-green-600 px-[3vw] py-[2vh] rounded-[5vw] hover:bg-green-50 transition-all text-[2vh] md:text-[1vw]">
            Contact Us
          </button>
        </div>
      </div>
      <div className="mt-[5vh] md:mt-[0vh] relative">
        <img
          src="/Gemini_Generated_Image_dj5du3dj5du3dj5d.png"
          alt="Potato Chips"
          className="w-[40vw] md:w-[30vw] drop-shadow-xl"
        />
      </div>
    </section>
  );
}
