import { Link } from "@/components/RouterLink";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Leather Shoes",
    description: "Footwear designed with durability, comfort, and clean finishing.",
    icon: "👞",
    slug: "shoes",
  },
  {
    name: "Belts",
    description: "Minimal, durable leather belts produced with precise cutting and stitching.",
    icon: "🔗",
    slug: "belts",
  },
  {
    name: "Wallets",
    description: "Clean, functional wallets crafted with disciplined detailing.",
    icon: "👛",
    slug: "wallets",
  },
  {
    name: "Bags",
    description: "Premium leather bags manufactured for international buyers seeking consistent finish.",
    icon: "💼",
    slug: "bags",
  },
  {
    name: "Kolhapuri Chappals",
    description: "Authentic Kolhapuri craftsmanship refined to meet global export standards.",
    icon: "🥿",
    slug: "kolhapuri",
  },
];

const ProductCategories = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
            Our Product Range
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specializing in premium leather products for global markets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link key={category.slug} to={`/products?category=${category.slug}`}>
              <Card 
                className="h-full hover:shadow-large transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold text-charcoal mb-3 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <div className="flex items-center text-primary group-hover:translate-x-2 transition-transform">
                    <span className="font-medium">Explore</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;