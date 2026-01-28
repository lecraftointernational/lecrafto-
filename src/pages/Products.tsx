import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import { Link } from "@/components/RouterLink";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  leather_type: string | null;
  color: string | null;
  sizes: string[] | null;
  moq: number;
  lead_time: string | null;
  image_url: string | null;
}

const categories = [
  { value: "all", label: "All Products" },
  { value: "shoes", label: "Leather Shoes" },
  { value: "belts", label: "Belts" },
  { value: "wallets", label: "Wallets" },
  { value: "bags", label: "Bags" },
  { value: "kolhapuri", label: "Kolhapuri" },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from("products").select("*").eq("is_published", true);

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory as any);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <>
      <Helmet>
        <title>Premium Leather Products | Lecrafto International</title>
        <meta
          name="description"
          content="Browse our premium collection of leather shoes, belts, wallets, bags, and Kolhapuri chappals. High-quality leather products for international buyers."
        />
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="bg-gradient-leather text-cream py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
            <p className="text-lg text-cream/90 max-w-2xl">
              Premium leather products crafted with precision for global markets
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-muted/50 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={selectedCategory === cat.value ? "bg-primary" : ""}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">Try selecting a different category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-large transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-16 h-16 text-muted-foreground" />
                        )}
                      </div>
                      <div className="mb-2">
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                      <div className="space-y-2 text-sm">
                        {product.leather_type && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Material:</span>
                            <span className="font-medium">{product.leather_type}</span>
                          </div>
                        )}
                        {product.color && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Color:</span>
                            <span className="font-medium">{product.color}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">MOQ:</span>
                          <span className="font-medium">{product.moq} pieces</span>
                        </div>
                        {product.lead_time && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Lead Time:</span>
                            <span className="font-medium">{product.lead_time}</span>
                          </div>
                        )}
                      </div>
                      <Button className="w-full mt-4" asChild>
                        <Link to="/contact">Request Quote</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Products;