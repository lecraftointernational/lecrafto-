import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ProductCategories from "@/components/home/ProductCategories";
import WhyChooseUs from "@/components/home/WhyChooseUs";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Lecrafto International - Premium Leather Exporter | Shoes, Belts, Wallets & More</title>
        <meta
          name="description"
          content="Premium leather footwear and accessories exporter. Manufacturer of leather shoes, belts, wallets, bags, and Kolhapuri chappals with global quality standards."
        />
        <meta
          name="keywords"
          content="leather exporter, leather shoes manufacturer, leather belts, leather wallets, Kolhapuri chappals, premium leather goods"
        />
        <link rel="canonical" href="https://lecrafto.com" />
      </Helmet>

      <Header />
      <main>
        <Hero />
        <ProductCategories />
        <WhyChooseUs />
      </main>
      <Footer />
    </>
  );
};

export default Home;