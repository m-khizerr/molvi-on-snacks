"use client";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const router = useRouter();

  const products = [
    { id: 1, name: "Seaweed Flavour", img: "/chocobliss.png", desc: "Crispy chips infused with ocean freshness.", price: 2.99 },
    { id: 2, name: "Balado Flavour", img: "/chocobliss.png", desc: "Sweet, spicy, and totally addictive.", price: 2.99 },
    { id: 3, name: "Jagung Flavour", img: "/chocobliss.png", desc: "A burst of buttery corn delight.", price: 2.99 },
    { id: 4, name: "Original Flavour", img: "/chocobliss.png", desc: "The timeless classic that started it all.", price: 2.99 },
  ];

  return (
    <main
      className="flex flex-col items-center bg-[#fdfbf9]"
      style={{ width: "100vw", minHeight: "100vh", paddingTop: "5vh" }}
    >
      {/* Header */}
      <section className="text-center" style={{ marginBottom: "5vh" }}>
        <h2
          className="text-gray-800 font-extrabold uppercase tracking-wider"
          style={{ fontSize: "1.4vw", marginBottom: "1vh" }}
        >
          Product
        </h2>
        <p
          className="text-gray-500"
          style={{
            fontSize: "1vw",
            width: "50vw",
            margin: "0 auto",
            marginBottom: "6vh",
            lineHeight: "1.6",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
          tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
        </p>
      </section>

      {/* Featured */}
      <section
        className="flex flex-col items-center text-center"
        style={{ width: "90vw", marginBottom: "10vh" }}
      >
        <h4
          className="text-orange-600 font-semibold uppercase"
          style={{ fontSize: "1.2vw", marginBottom: "1vh" }}
        >
          Featured Product
        </h4>

        <h1
          className="text-gray-900 font-extrabold"
          style={{ fontSize: "2.5vw", marginBottom: "2vh" }}
        >
          CHOOSE YOUR FAVOURITE TASTE
        </h1>

        <p
          className="text-gray-500"
          style={{
            fontSize: "1vw",
            width: "50vw",
            marginBottom: "6vh",
            lineHeight: "1.6",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
          tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
        </p>

        {/* Product Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-[2vw] justify-items-center"
          style={{ width: "90vw" }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/products/${p.id}`)}
              className="flex flex-col items-center bg-white rounded-[1.2vw] shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{
                width: "20vw",
                height: "45vh",
                padding: "2vh 1.5vw",
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                style={{
                  width: "10vw",
                  height: "auto",
                  marginBottom: "2vh",
                  transform: "translateY(-2vh)",
                }}
              />
              <h2
                className="font-bold text-gray-900"
                style={{
                  fontSize: "1.2vw",
                  marginBottom: "1vh",
                }}
              >
                {p.name.toUpperCase()}
              </h2>
              <p
                className="text-gray-500 text-center"
                style={{
                  fontSize: "0.9vw",
                  width: "15vw",
                  marginBottom: "1.5vh",
                  lineHeight: "1.5",
                }}
              >
                {p.desc}
              </p>
              <span className="text-orange-600 font-semibold" style={{ fontSize: "1vw" }}>
                ${p.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
