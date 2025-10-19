"use client";
import Link from "next/link";
import { useState } from "react";
import { BiCart } from "react-icons/bi";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 flex justify-center"
      style={{ padding: "1vh 15vw" }}
    >
      <header
        className="bg-green-900 text-white flex flex-col md:flex-row items-center justify-between rounded-[2vw]"
        style={{
          width: "90vw",
          padding: "2vh 3vw",
          boxShadow: "0 0.4vh 1vh rgba(0,0,0,0.15)",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-extrabold tracking-wide"
          style={{
            fontSize: "2vw",
            lineHeight: "1",
          }}
        >
          Molvi
          <span style={{ color: "#facc15" }}>Snacks</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center justify-center"
          style={{
            gap: "2vw",
            fontSize: "1vw",
            fontWeight: "500",
          }}
        >
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <BiCart />
        </nav>


        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            fontSize: "4vw",
            marginTop: "1vh",
          }}
        >
          ☰
        </button>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div
            className="md:hidden flex flex-col items-center"
            style={{
              width: "100%",
              backgroundColor: "#065f46",
              marginTop: "2vh",
              borderRadius: "2vw",
              padding: "2vh 3vw",
              gap: "2vh",
              fontSize: "3.5vw",
            }}
          >
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/products" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
            <button
              className="font-semibold transition"
              style={{
                backgroundColor: "#facc15",
                color: "#064e3b",
                padding: "1.5vh 4vw",
                borderRadius: "5vw",
                fontSize: "3vw",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fde047")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#facc15")}
            >
              Shop Now
            </button>
          </div>
        )}
      </header>
    </div>
  );
}
