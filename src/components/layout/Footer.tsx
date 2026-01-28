import { Link } from "@/components/RouterLink";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-leather-dark text-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">Lecrafto International</h3>
            <p className="text-cream/80 text-sm">
              Premium leather manufacturer and exporter. Delivering excellence in leather footwear and accessories worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-cream/80 hover:text-accent transition-colors text-sm">Products</Link></li>
              <li><Link to="/about" className="text-cream/80 hover:text-accent transition-colors text-sm">About Us</Link></li>
              <li><Link to="/export" className="text-cream/80 hover:text-accent transition-colors text-sm">Export Capabilities</Link></li>
              <li><Link to="/contact" className="text-cream/80 hover:text-accent transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              <li><Link to="/products?category=shoes" className="text-cream/80 hover:text-accent transition-colors text-sm">Leather Shoes</Link></li>
              <li><Link to="/products?category=belts" className="text-cream/80 hover:text-accent transition-colors text-sm">Belts</Link></li>
              <li><Link to="/products?category=wallets" className="text-cream/80 hover:text-accent transition-colors text-sm">Wallets</Link></li>
              <li><Link to="/products?category=bags" className="text-cream/80 hover:text-accent transition-colors text-sm">Bags</Link></li>
              <li><Link to="/products?category=kolhapuri" className="text-cream/80 hover:text-accent transition-colors text-sm">Kolhapuri Chappals</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a href="mailto:lecraftointernational2@gmail.com" className="text-cream/80 hover:text-accent transition-colors text-sm">
                  lecraftointernational2@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-cream/80 text-sm">
                  <a href="tel:+918308257226" className="hover:text-accent transition-colors block">Sumit Jadhav - 8308257226</a>
                  <a href="tel:+919960074316" className="hover:text-accent transition-colors block">Shamali Mane - 9960074316</a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-cream/80 text-sm">
                  1175 E Prashik Chowk, Haripur Road, Goanbhag, Sangli - 416416
                </span>
              </li>
            </ul>
            <p className="text-cream/80 text-sm mt-4 font-medium">
              GST: 27CGJPJ5944H1Z2
            </p>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream/60 text-sm">
              © 2025 Lecrafto International. All rights reserved.
            </p>
            <p className="text-cream/50 text-xs italic">
              Some product images are temporary placeholders used for design reference.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;