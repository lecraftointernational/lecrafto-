import { CheckCircle2 } from "lucide-react";
import { Link } from "@/components/RouterLink";

const features = [
  "In-house manufacturing",
  "Skilled workers and disciplined production",
  "Global-standard quality benchmarks",
  "Consistent finishing and reliable supply",
  "Clean, minimal designs for global markets",
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-muted-foreground">
              Excellence in every stitch, reliability in every delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 animate-slideIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                </div>
                <p className="text-lg text-foreground">{feature}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-gradient-leather rounded-2xl text-cream text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Partner With Us?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join international buyers who trust Lecrafto for premium leather products
            </p>
            <Link
              to="/contact"
              className="inline-block bg-accent hover:bg-accent/90 text-charcoal font-semibold px-8 py-3 rounded-lg transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;