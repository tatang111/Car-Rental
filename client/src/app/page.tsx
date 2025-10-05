import Banner from "@/components/Banner";
import FeaturedSection from "@/components/FeaturedSection";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import Testimonial from "@/components/Testimonial";

export default function Home() {
  return (
    <div>
      <Hero /> 
      <FeaturedSection />
      <Banner />
      <Testimonial />
      <Newsletter />
    </div>
  );
}