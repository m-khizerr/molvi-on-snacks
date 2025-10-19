export default function Ingredients() {
  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">
        Made From High Quality Ingredients
      </h2>
      <p className="max-w-2xl mx-auto text-gray-600 mb-10">
        Our snacks are made using 100% fresh potatoes, low calories, natural
        flavors, and halal-certified ingredients — for everyone to enjoy guilt-free!
      </p>

      <div className="flex flex-wrap justify-center gap-10">
        <div className="w-40">
          <img src="/chips.png" alt="High Quality" className="mx-auto mb-2" />
          <p className="font-semibold">100% Potato</p>
        </div>
        <div className="w-40">
          <img src="/chips2.png" alt="Low Calories" className="mx-auto mb-2" />
          <p className="font-semibold">Low Calories</p>
        </div>
        <div className="w-40">
          <img src="/chips3.png" alt="Natural Flavors" className="mx-auto mb-2" />
          <p className="font-semibold">Natural Flavors</p>
        </div>
        <div className="w-40">
          <img src="/chips4.png" alt="Halal Certified" className="mx-auto mb-2" />
          <p className="font-semibold">100% Halal</p>
        </div>
      </div>
    </section>
  );
}
