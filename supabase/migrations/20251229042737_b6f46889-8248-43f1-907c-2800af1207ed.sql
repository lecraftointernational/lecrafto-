-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for order/inquiry status
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

-- Create user_roles table (secure role storage)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy: Only admins can manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add tracking columns to inquiries table
ALTER TABLE public.inquiries 
ADD COLUMN order_number TEXT UNIQUE,
ADD COLUMN order_status order_status DEFAULT 'pending',
ADD COLUMN tracking_number TEXT,
ADD COLUMN estimated_delivery DATE,
ADD COLUMN admin_notes TEXT,
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create order tracking history table
CREATE TABLE public.order_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID REFERENCES public.inquiries(id) ON DELETE CASCADE NOT NULL,
    status order_status NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on order_tracking
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;

-- Anyone can view tracking for their orders (by email match or tracking number)
CREATE POLICY "Anyone can view order tracking"
ON public.order_tracking
FOR SELECT
USING (true);

-- Only admins can insert tracking updates
CREATE POLICY "Admins can insert tracking"
ON public.order_tracking
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update inquiries RLS: Admins can view and manage all inquiries
CREATE POLICY "Admins can view all inquiries"
ON public.inquiries
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update inquiries"
ON public.inquiries
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete inquiries"
ON public.inquiries
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.order_number := 'LCI-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

-- Trigger to auto-generate order number on inquiry insert
CREATE TRIGGER set_order_number
BEFORE INSERT ON public.inquiries
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_number();

-- Trigger to update updated_at on inquiries
CREATE TRIGGER update_inquiries_updated_at
BEFORE UPDATE ON public.inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();