export default function Testimonials() {
  return (
    <section className="py-20 px-6 bg-white text-center">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">
        What Our Customers Say
      </h2>

      <div className="max-w-4xl mx-auto bg-green-900 text-white rounded-3xl p-10 shadow-lg">
        <p className="italic mb-4 text-lg leading-relaxed">
          “Molvi on Snacks chips are the crispiest and tastiest I’ve ever had! I love
          the BBQ flavor — my kids can’t get enough of it. Highly recommended!”
        </p>
        <p className="font-semibold">— Ayesha Khan, Karachi</p>
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <span className="w-3 h-3 rounded-full bg-green-900"></span>
        <span className="w-3 h-3 rounded-full bg-gray-400"></span>
        <span className="w-3 h-3 rounded-full bg-gray-400"></span>
      </div>
    </section>
  );
}
