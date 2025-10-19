"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function ProductShowcase() {
  const products = [
    {
      name: "Seaweed Flavour",
      img: "/chocobliss.png",
      desc: "Crispy chips infused with ocean freshness.",
      highlight: false,
    },
    {
      name: "Balado Flavour",
      img: "/chocobliss.png",
      desc: "Sweet, spicy, and totally addictive.",
      highlight: false,
    },
    {
      name: "Jagung Flavour",
      img: "/chocobliss.png",
      desc: "A burst of buttery corn delight.",
      highlight: false,
    },
    {
      name: "Original Flavour",
      img: "/chocobliss.png",
      desc: "The timeless classic that started it all.",
      highlight: true,
    },
  ];

  return (
    <section
      className="flex flex-col items-center justify-center text-center"
      style={{
        height: "100vh",
        paddingTop: "5vh",
        paddingBottom: "5vh",
      }}
    >
      <h3
        className="text-orange-600 font-semibold uppercase"
        style={{ fontSize: "1.2vw", marginBottom: "1vh" }}
      >
        Featured Product
      </h3>

      <h1
        className="text-gray-800 font-extrabold"
        style={{
          fontSize: "3vw",
          marginBottom: "2vh",
        }}
      >
        CHOOSE YOUR FAVOURITE TASTE
      </h1>

      <p
        className="text-gray-500 text-center"
        style={{
          width: "50vw",
          fontSize: "1vw",
          marginBottom: "6vh",
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus,
        luctus nec ullamcorper mattis, pulvinar dapibus leo.
      </p>

      <div
        className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-[2vw]"
        style={{
          width: "85vw",
        }}
      >
        {products.map((p, i) => (
          <div
            key={i}
            className={`rounded-[2vw] transition-all duration-300 flex flex-col items-center justify-start text-center ${
              p.highlight
                ? "bg-[#063b2d] text-white shadow-lg"
                : "bg-white text-gray-800"
            }`}
            style={{
              height: "55vh",
              padding: "3vh 2vw",
              boxShadow: p.highlight
                ? "0 0 3vw rgba(0,0,0,0.1)"
                : "0 0 1vw rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={p.img}
              alt={p.name}
              style={{
                width: "12vw",
                height: "auto",
                marginBottom: "2vh",
                transform: "translateY(-2vh)",
              }}
            />
            <h2
              className="font-bold"
              style={{
                fontSize: "1.4vw",
                marginBottom: "1vh",
              }}
            >
              {p.name.toUpperCase()}
            </h2>
            <p
              className="text-gray-500 md:text-gray-400"
              style={{
                fontSize: "1vw",
                marginBottom: "2vh",
                color: p.highlight ? "#d1d5db" : "#6b7280",
              }}
            >
              {p.desc}
            </p>
            <div className="flex justify-center space-x-[0.4vw]">
              {[...Array(5)].map((_, j) => (
                <span key={j} style={{ fontSize: "1vw", color: "#fbbf24" }}>
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
