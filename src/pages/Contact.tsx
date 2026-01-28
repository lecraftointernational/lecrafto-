import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    country: "",
    product_interest: "",
    moq: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.from("inquiries").insert([
        {
          ...formData,
          moq: formData.moq ? parseInt(formData.moq) : null,
        },
      ]).select("order_number").single();

      if (error) throw error;

      // Send confirmation email
      try {
        await supabase.functions.invoke("send-order-confirmation", {
          body: {
            email: formData.email,
            name: formData.name,
            orderNumber: data.order_number,
            productInterest: formData.product_interest,
            message: formData.message,
          },
        });
      } catch (emailError) {
        console.log("Email notification failed:", emailError);
      }

      toast({
        title: "Inquiry Submitted!",
        description: `Your order number is ${data.order_number}. We'll get back to you within 24 hours.`,
      });

      setFormData({
        name: "",
        company: "",
        email: "",
        country: "",
        product_interest: "",
        moq: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Lecrafto International - Get a Quote</title>
        <meta name="description" content="Contact Lecrafto International for inquiries about premium leather products. Request quotes, samples, and partnership opportunities." />
      </Helmet>

      <Header />
      <main className="bg-background">
        <section className="bg-gradient-leather text-cream py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-cream/90">Get in touch for quotes and inquiries</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold mb-6">Send an Inquiry</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input placeholder="Your Name *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  <Input placeholder="Company Name" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                  <Input type="email" placeholder="Email *" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  <Input placeholder="Country *" required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                  <Input placeholder="Product Interest" value={formData.product_interest} onChange={(e) => setFormData({ ...formData, product_interest: e.target.value })} />
                  <Input type="number" placeholder="MOQ (pieces)" value={formData.moq} onChange={(e) => setFormData({ ...formData, moq: e.target.value })} />
                  <Textarea placeholder="Your Message *" required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                  <Button type="submit" disabled={loading} className="w-full bg-primary">{loading ? "Submitting..." : "Submit Inquiry"}</Button>
                </form>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex gap-4"><Mail className="w-6 h-6 text-primary" /><div><p className="font-semibold">Email</p><a href="mailto:lecraftointernational2@gmail.com" className="text-muted-foreground hover:text-primary">lecraftointernational2@gmail.com</a></div></div>
                    <div className="flex gap-4"><Phone className="w-6 h-6 text-primary" /><div><p className="font-semibold">Phone</p><div className="text-muted-foreground"><a href="tel:+918308257226" className="hover:text-primary">Sumit Jadhav - 8308257226</a><br/><a href="tel:+919960074316" className="hover:text-primary">Shamali Mane - 9960074316</a></div></div></div>
                    <div className="flex gap-4"><MapPin className="w-6 h-6 text-primary" /><div><p className="font-semibold">Address</p><p className="text-muted-foreground">1175 E Prashik Chowk, Haripur Road,<br/>Goanbhag, Sangli - 416416</p></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;