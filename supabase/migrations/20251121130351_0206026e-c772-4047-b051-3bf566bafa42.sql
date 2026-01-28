-- Product categories enum
CREATE TYPE product_category AS ENUM ('shoes', 'belts', 'wallets', 'bags', 'kolhapuri');

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category product_category NOT NULL,
  description TEXT NOT NULL,
  leather_type TEXT,
  color TEXT,
  sizes TEXT[],
  moq INTEGER NOT NULL DEFAULT 100,
  lead_time TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inquiries table
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  product_interest TEXT,
  moq INTEGER,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view published products"
ON public.products FOR SELECT
USING (is_published = true);

-- RLS Policies for inquiries (insert only)
CREATE POLICY "Anyone can submit inquiries"
ON public.inquiries FOR INSERT
WITH CHECK (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, category, description, leather_type, color, sizes, moq, lead_time) VALUES
('Classic Oxford Shoes', 'shoes', 'Premium leather oxford shoes with durable sole and elegant finishing.', 'Full Grain Leather', 'Black', ARRAY['38', '39', '40', '41', '42', '43', '44', '45'], 100, '45-60 days'),
('Derby Formal Shoes', 'shoes', 'Handcrafted derby shoes perfect for formal occasions.', 'Top Grain Leather', 'Brown', ARRAY['38', '39', '40', '41', '42', '43', '44', '45'], 100, '45-60 days'),
('Premium Leather Belt', 'belts', 'Minimal durable leather belt with precise cutting and stitching.', 'Genuine Leather', 'Black', ARRAY['32', '34', '36', '38', '40', '42'], 200, '30-45 days'),
('Classic Wallet', 'wallets', 'Clean functional wallet crafted with disciplined detailing.', 'Full Grain Leather', 'Brown', ARRAY['Standard'], 300, '30-45 days'),
('Executive Briefcase', 'bags', 'Premium leather bag manufactured for international buyers.', 'Full Grain Leather', 'Tan', ARRAY['Standard'], 50, '60-75 days'),
('Authentic Kolhapuri', 'kolhapuri', 'Traditional Kolhapuri craftsmanship refined to meet global export standards.', 'Vegetable Tanned Leather', 'Natural', ARRAY['38', '39', '40', '41', '42', '43'], 150, '30-45 days');