export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-10 px-6 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-2">Molvi on Snacks</h3>
          <p>Delicious snacks made with real ingredients and lots of love.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li>About</li>
            <li>Products</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p>Email: info@molvionsnacks.com</p>
          <p>Phone: +92 300 1234567</p>
        </div>
      </div>
      <div className="mt-8 text-center text-sm opacity-75">
        © {new Date().getFullYear()} Molvi on Snacks. All rights reserved.
      </div>
    </footer>
  );
}
