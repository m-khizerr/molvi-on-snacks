import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Molvi on Snacks",
  description: "Eat our grilled potato chips made from high-quality ingredients.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FFFBEA]`}>
        {/* <Header /> */}
        {children}
        <NavBar />
        {/* <Footer /> */}
      </body>
    </html>
  );
}
