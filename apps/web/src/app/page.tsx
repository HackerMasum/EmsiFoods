import { Navbar } from "@/components/layout/navbar";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
    </>
  );
}
