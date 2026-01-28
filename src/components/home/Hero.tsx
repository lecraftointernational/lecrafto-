import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/components/RouterLink";
import heroShoes from "@/assets/hero-shoes.jpg";
import heroAccessories from "@/assets/hero-accessories.jpg";
import heroKolhapuri from "@/assets/hero-kolhapuri.jpg";

const slides = [
  {
    image: heroShoes,
    title: "Premium Leather. Global Standards.",
    subtitle: "Manufacturer & Exporter of Premium Leather Footwear",
  },
  {
    image: heroAccessories,
    title: "Exquisite Craftsmanship",
    subtitle: "Manufacturer & Exporter of Leather Accessories",
  },
  {
    image: heroKolhapuri,
    title: "Authentic Kolhapuri",
    subtitle: "Traditional Craftsmanship Meets Global Quality",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-charcoal/50" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl text-cream">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fadeInUp">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-4 animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-charcoal font-semibold">
                    <Link to="/contact">Request Sample</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-cream text-cream hover:bg-cream hover:text-charcoal">
                    <Link to="/products">View Products</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-cream/20 hover:bg-cream/30 text-cream p-2 rounded-full backdrop-blur-sm transition-all"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-cream/20 hover:bg-cream/30 text-cream p-2 rounded-full backdrop-blur-sm transition-all"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-accent w-8" : "bg-cream/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;