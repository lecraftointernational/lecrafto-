import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TrackOrderRequest {
  searchQuery: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchQuery }: TrackOrderRequest = await req.json();

    // Input validation - sanitize the search query
    if (!searchQuery || typeof searchQuery !== "string") {
      return new Response(
        JSON.stringify({ error: "Search query is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Sanitize input - remove any special characters that could cause issues
    const sanitizedQuery = searchQuery.trim().slice(0, 100);
    
    // Validate format - should be either an email or order number format
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedQuery);
    const isOrderNumber = /^LCI-\d{8}-\d{4}$/.test(sanitizedQuery);
    
    if (!isEmail && !isOrderNumber) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid format. Please enter a valid email or order number (e.g., LCI-20250101-1234)" 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client with service role for server-side access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Query for the order using parameterized queries (safe from SQL injection)
    let orderQuery = supabase
      .from("inquiries")
      .select("id, order_number, name, product_interest, order_status, tracking_number, estimated_delivery, created_at")
      .order("created_at", { ascending: false })
      .limit(1);

    if (isEmail) {
      orderQuery = orderQuery.eq("email", sanitizedQuery);
    } else {
      orderQuery = orderQuery.eq("order_number", sanitizedQuery);
    }

    const { data: orderData, error: orderError } = await orderQuery.maybeSingle();

    if (orderError) {
      console.error("Order query error:", orderError);
      return new Response(
        JSON.stringify({ error: "Failed to search for order" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!orderData) {
      return new Response(
        JSON.stringify({ order: null, tracking: [] }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch tracking history for this specific order only
    const { data: trackingData, error: trackingError } = await supabase
      .from("order_tracking")
      .select("id, status, message, created_at")
      .eq("inquiry_id", orderData.id)
      .order("created_at", { ascending: true });

    if (trackingError) {
      console.error("Tracking query error:", trackingError);
    }

    // Return order data without sensitive fields (email is not returned)
    return new Response(
      JSON.stringify({ 
        order: orderData, 
        tracking: trackingData || [] 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
