import HeroSection from "../../components/HeroSection";
import Testimonials from "../../components/HeroSection";
import ProductShowcase from "../../components/ProductShowcase";

export default function HomePage() {
  return (
    <main className="px-20">
      <HeroSection />
      <ProductShowcase />
    </main>
  );
}
