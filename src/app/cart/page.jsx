"use client";
import { useCartStore } from "@/context/useCartStore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, clearCart } = useCartStore();

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <main
      className="flex flex-col items-center bg-[#fdfbf9]"
      style={{
        width: "100vw",
        minHeight: "100vh",
        paddingTop: "5vh",
        paddingBottom: "10vh",
      }}
    >
      <h1
        className="font-extrabold text-gray-800 uppercase tracking-wide"
        style={{ fontSize: "2vw", marginBottom: "4vh" }}
      >
        Your Cart
      </h1>

      {items.length === 0 ? (
        <div className="text-center" style={{ fontSize: "1vw" }}>
          <p className="text-gray-600 mb-[2vh]">Your cart is empty.</p>
          <button
            onClick={() => router.push("/products")}
            className="text-white bg-[#063b2d] rounded-md hover:bg-[#08503d]"
            style={{ padding: "1vh 2vw", fontSize: "1vw" }}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div
            className="flex flex-col gap-[2vh]"
            style={{
              width: "70vw",
              marginBottom: "5vh",
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center justify-between bg-white rounded-[1vw] shadow-sm"
                style={{ padding: "2vh 2vw" }}
              >
                <div className="flex items-center gap-[2vw]">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "8vw", height: "auto" }}
                  />
                  <div>
                    <h3
                      className="font-bold text-gray-900"
                      style={{ fontSize: "1.2vw" }}
                    >
                      {item.name}
                    </h3>
                    <p
                      className="text-gray-500"
                      style={{ fontSize: "0.9vw" }}
                    >
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-[2vw]">
                  <p
                    className="font-semibold text-orange-600"
                    style={{ fontSize: "1.1vw" }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                    style={{ fontSize: "1vw" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            className="flex flex-col items-center text-center bg-[#f9f2e8] rounded-[1vw]"
            style={{ width: "60vw", padding: "3vh 2vw" }}
          >
            <h2
              className="font-bold text-gray-800"
              style={{ fontSize: "1.4vw", marginBottom: "2vh" }}
            >
              Total: ${total.toFixed(2)}
            </h2>
            <div className="flex gap-[1vw]">
              <button
                onClick={() => alert("Checkout coming soon!")}
                className="bg-[#063b2d] text-white rounded-md hover:bg-[#08503d]"
                style={{ padding: "1vh 2vw", fontSize: "1vw" }}
              >
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="bg-red-500 text-white rounded-md hover:bg-red-600"
                style={{ padding: "1vh 2vw", fontSize: "1vw" }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
