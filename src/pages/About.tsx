import { Helmet } from "react-helmet";
import { Link } from "@/components/RouterLink";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Target, Eye, Award } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Lecrafto International - Premium Leather Manufacturer</title>
        <meta
          name="description"
          content="Learn about Lecrafto International, a trusted leather manufacturer crafting premium shoes, belts, wallets, bags, and Kolhapuri chappals for global markets."
        />
      </Helmet>

      <Header />
      <main className="bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-leather text-cream py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About Lecrafto International
            </h1>
            <p className="text-xl text-cream/90 max-w-3xl">
              Crafting excellence in leather since our inception
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-foreground leading-relaxed mb-8">
                  Lecrafto International is a leather artisan, crafting premium leather shoes, belts, wallets, bags, 
                  and Kolhapuri chappals. With skilled hands and in-house expertise, we deliver flawless finishing, 
                  consistent quality, and reliable supply for discerning international buyers. Our focus is on precision 
                  craftsmanship, timeless design, and long-term partnerships built on trust.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="bg-background p-8 rounded-2xl shadow-medium">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To deliver top-quality leather products with disciplined craftsmanship and consistency. 
                  To earn a reputation for reliability, refined design, and superior standards worldwide.
                </p>
              </div>

              <div className="bg-background p-8 rounded-2xl shadow-medium">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <Eye className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Vision</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To become the most trusted partner for international buyers seeking premium leather products, 
                  recognized globally for our unwavering commitment to quality and craftsmanship.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Profile */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <Award className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Company Profile</h2>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-foreground leading-relaxed">
                  Lecrafto International is a leather manufacturer producing leather shoes, belts, wallets, bags, 
                  and Kolhapuri chappals. With skilled workers and streamlined in-house craftsmanship, we ensure 
                  consistent quality, flawless finishing, and products meeting international standards. We work with 
                  international buyers who value precision, minimalistic design, and reliable supply. Our aim is to 
                  build long-term partnerships and establish ourselves as a trusted source for premium leather products 
                  in global markets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-leather text-cream">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Partner With Excellence
            </h2>
            <p className="text-xl text-cream/90 mb-8 max-w-2xl mx-auto">
              Discover how Lecrafto International can be your trusted partner for premium leather products
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/products"
                className="inline-block bg-accent hover:bg-accent/90 text-charcoal font-semibold px-8 py-3 rounded-lg transition-all"
              >
                View Products
              </Link>
              <Link
                to="/contact"
                className="inline-block bg-transparent border-2 border-cream hover:bg-cream hover:text-charcoal text-cream font-semibold px-8 py-3 rounded-lg transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;