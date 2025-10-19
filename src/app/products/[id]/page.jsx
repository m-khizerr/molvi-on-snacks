"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/context/useCartStore"; // ✅ adjust path as needed

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const product = {
    id,
    name: "Potato Chip",
    flavour: "Original Flavour",
    img: "/chocobliss.png",
    price: 2.99,
    desc: "Crispy, savoury, and irresistibly delicious chips for any occasion.",
  };

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: `${product.name} - ${product.flavour}`,
      price: product.price,
      image: product.img,
      quantity: Number(quantity),
    });
    alert(`${quantity} ${product.name} added to cart!`);
    router.push("/cart");
  };

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
          Product Detail
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

      {/* Product */}
      <section
        className="flex flex-col md:flex-row items-center justify-center"
        style={{ width: "90vw", gap: "5vw", marginBottom: "10vh" }}
      >
        <img
          src={product.img}
          alt={product.name}
          style={{ width: "25vw", height: "auto" }}
        />

        <div style={{ width: "35vw", textAlign: "left" }}>
          <h1
            className="text-gray-900 font-extrabold"
            style={{ fontSize: "2.5vw", marginBottom: "1vh" }}
          >
            {product.name}
          </h1>
          <h3
            className="text-gray-600 font-semibold uppercase"
            style={{ fontSize: "1vw", marginBottom: "3vh" }}
          >
            {product.flavour}
          </h3>

          <label
            className="block font-medium text-gray-700"
            style={{ fontSize: "1vw", marginBottom: "0.5vh" }}
          >
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border border-gray-300 rounded-md px-[1vw] py-[0.5vh] mb-[2vh]"
            style={{ width: "10vw", fontSize: "1vw" }}
          />

          <p
            className="text-orange-600 font-bold"
            style={{ fontSize: "1.4vw", marginBottom: "2vh" }}
          >
            ${(product.price * quantity).toFixed(2)}
          </p>

          <p
            className="text-gray-600"
            style={{ fontSize: "1vw", lineHeight: "1.6", marginBottom: "2vh" }}
          >
            {product.desc}
          </p>

          <button
            onClick={handleAddToCart}
            className="bg-[#063b2d] text-white rounded-md transition-all hover:bg-[#08503d]"
            style={{ padding: "1vh 2vw", fontSize: "1vw", fontWeight: "600" }}
          >
            Add to Cart
          </button>
        </div>
      </section>

      <button
        onClick={() => router.push("/products")}
        className="text-gray-500 hover:text-gray-700 underline"
        style={{ fontSize: "1vw" }}
      >
        ← Back to Products
      </button>
    </main>
  );
}
