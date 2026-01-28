import { Helmet } from "react-helmet";
import { Link } from "@/components/RouterLink";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Factory, Users, TrendingUp, Shield, Clock, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const capabilities = [
  {
    icon: Factory,
    title: "In-House Manufacturing",
    description: "Complete control over production ensures consistent quality and reliable delivery timelines.",
  },
  {
    icon: Users,
    title: "Skilled Workforce",
    description: "Our team of experienced artisans brings decades of leather craftsmanship expertise.",
  },
  {
    icon: TrendingUp,
    title: "Production Capacity",
    description: "Scalable manufacturing capabilities to meet orders from small to large volumes.",
  },
  {
    icon: Shield,
    title: "Quality Control",
    description: "Rigorous quality checks at every stage ensure global-standard products.",
  },
  {
    icon: Clock,
    title: "Lead Times",
    description: "Efficient production processes with lead times ranging from 30-75 days depending on product.",
  },
  {
    icon: Globe,
    title: "Global Standards",
    description: "Products manufactured to meet international quality and safety certifications.",
  },
];

const Export = () => {
  return (
    <>
      <Helmet>
        <title>Export Capabilities - Lecrafto International</title>
        <meta
          name="description"
          content="Learn about Lecrafto International's export capabilities, production capacity, quality control, and commitment to delivering premium leather products worldwide."
        />
      </Helmet>

      <Header />
      <main className="bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-leather text-cream py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Export Capabilities
            </h1>
            <p className="text-xl text-cream/90 max-w-3xl">
              Delivering premium leather products to discerning buyers worldwide
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto mb-16">
              <p className="text-lg text-foreground leading-relaxed">
                At Lecrafto International, we combine traditional craftsmanship with modern manufacturing 
                practices to deliver premium leather products that meet the exacting standards of international 
                buyers. Our comprehensive export capabilities ensure reliability, quality, and consistency in 
                every shipment.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-large transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="bg-primary/10 p-4 rounded-lg w-fit mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{capability.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {capability.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* MOQ & Lead Times */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                Order Requirements
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Minimum Order Quantities</h3>
                    <ul className="space-y-3 text-foreground">
                      <li className="flex justify-between">
                        <span>Leather Shoes:</span>
                        <span className="font-semibold">100 pairs</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Kolhapuri Chappals:</span>
                        <span className="font-semibold">150 pairs</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Belts:</span>
                        <span className="font-semibold">200 pieces</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Wallets:</span>
                        <span className="font-semibold">300 pieces</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Bags:</span>
                        <span className="font-semibold">50 pieces</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Production Lead Times</h3>
                    <ul className="space-y-3 text-foreground">
                      <li className="flex justify-between">
                        <span>Belts & Wallets:</span>
                        <span className="font-semibold">30-45 days</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Kolhapuri Chappals:</span>
                        <span className="font-semibold">30-45 days</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Leather Shoes:</span>
                        <span className="font-semibold">45-60 days</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Bags:</span>
                        <span className="font-semibold">60-75 days</span>
                      </li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      * Lead times may vary based on order size and customization requirements
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Materials & Quality */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Materials & Quality Standards
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Premium Leather Types</h3>
                  <p className="text-muted-foreground">
                    We work with Full Grain Leather, Top Grain Leather, Genuine Leather, and Vegetable 
                    Tanned Leather to ensure the highest quality in our products.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
                  <p className="text-muted-foreground">
                    Every product undergoes multiple quality checks throughout the manufacturing process, 
                    from raw material selection to final finishing, ensuring consistency and excellence.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">International Compliance</h3>
                  <p className="text-muted-foreground">
                    Our manufacturing processes and products comply with international standards for 
                    leather goods, ensuring they meet requirements for export to global markets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-leather text-cream">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Place Your Order?
            </h2>
            <p className="text-xl text-cream/90 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your requirements and receive a detailed quotation
            </p>
            <Link
              to="/contact"
              className="inline-block bg-accent hover:bg-accent/90 text-charcoal font-semibold px-8 py-3 rounded-lg transition-all"
            >
              Request Quotation
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Export;