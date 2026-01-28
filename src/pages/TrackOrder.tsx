import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock, Search, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

interface OrderData {
  id: string;
  order_number: string;
  name: string;
  email: string;
  product_interest: string | null;
  order_status: string;
  tracking_number: string | null;
  estimated_delivery: string | null;
  created_at: string;
}

interface TrackingStep {
  id: string;
  status: string;
  message: string | null;
  created_at: string;
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-5 h-5" />,
  confirmed: <CheckCircle className="w-5 h-5" />,
  processing: <Package className="w-5 h-5" />,
  shipped: <Truck className="w-5 h-5" />,
  delivered: <CheckCircle className="w-5 h-5" />,
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  processing: "bg-purple-500",
  shipped: "bg-orange-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const TrackOrder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      // Use secure edge function to search for order
      const { data, error } = await supabase.functions.invoke("track-order", {
        body: { searchQuery: searchQuery.trim() },
      });

      if (error) throw error;

      if (!data.order) {
        setOrder(null);
        setTrackingSteps([]);
        toast({
          title: "Order Not Found",
          description: "No order found with that order number or email.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      setOrder(data.order);
      setTrackingSteps(data.tracking || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to search for order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Track Your Order - Lecrafto International</title>
        <meta name="description" content="Track your leather product order from Lecrafto International. Enter your order number or email to see the current status." />
      </Helmet>

      <Header />
      <main className="bg-background min-h-screen">
        <section className="bg-gradient-leather text-cream py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Track Your Order</h1>
            <p className="text-xl text-cream/90">Enter your order number or email to track your shipment</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-12">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter Order Number (e.g., LCI-20241229-1234) or Email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Track"}
              </Button>
            </form>

            {/* Order Details */}
            {order && (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Order Header */}
                <div className="bg-primary/10 p-6 border-b border-border">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Number</p>
                      <p className="text-2xl font-bold font-mono">{order.order_number}</p>
                    </div>
                    <Badge className={`${statusColors[order.order_status] || "bg-gray-500"} text-white text-lg px-4 py-2`}>
                      {statusIcons[order.order_status]}
                      <span className="ml-2 capitalize">{order.order_status}</span>
                    </Badge>
                  </div>
                </div>

                {/* Order Info */}
                <div className="p-6 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Product</p>
                        <p className="font-medium">{order.product_interest || "General Inquiry"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Order Date</p>
                        <p className="font-medium">{format(new Date(order.created_at), "dd MMMM yyyy")}</p>
                      </div>
                    </div>
                    {order.tracking_number && (
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Tracking Number</p>
                          <p className="font-medium font-mono">{order.tracking_number}</p>
                        </div>
                      </div>
                    )}
                    {order.estimated_delivery && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                          <p className="font-medium">{format(new Date(order.estimated_delivery), "dd MMMM yyyy")}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  {trackingSteps.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-semibold text-lg mb-4">Tracking History</h3>
                      <div className="space-y-4">
                        {trackingSteps.map((step, index) => (
                          <div key={step.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${statusColors[step.status]}`}>
                                {statusIcons[step.status] || <Clock className="w-5 h-5" />}
                              </div>
                              {index < trackingSteps.length - 1 && (
                                <div className="w-0.5 h-full bg-border mt-2 min-h-[20px]"></div>
                              )}
                            </div>
                            <div className="pb-4">
                              <p className="font-semibold capitalize">{step.status}</p>
                              {step.message && <p className="text-muted-foreground">{step.message}</p>}
                              <p className="text-sm text-muted-foreground mt-1">
                                {format(new Date(step.created_at), "dd MMM yyyy, HH:mm")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No Results */}
            {searched && !order && !loading && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Order Not Found</h3>
                <p className="text-muted-foreground">
                  Please check your order number or email and try again.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TrackOrder;
