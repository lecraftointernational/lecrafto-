import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderUpdateRequest {
  email: string;
  name: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  message?: string;
}

const statusMessages: Record<string, string> = {
  pending: "Your order is pending review.",
  confirmed: "Your order has been confirmed! We are preparing your items.",
  processing: "Your order is being processed and prepared for shipment.",
  shipped: "Your order has been shipped! It's on its way to you.",
  delivered: "Your order has been delivered. Thank you for your business!",
  cancelled: "Your order has been cancelled. Please contact us if you have questions.",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT token - this function requires admin authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with the user's JWT token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      console.error("Role check failed:", roleError);
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, name, orderNumber, status, trackingNumber, estimatedDelivery, message }: OrderUpdateRequest = await req.json();

    // Input validation
    if (!email || !name || !orderNumber || !status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, name, orderNumber, status" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Admin ${user.email} sending order update to ${email} for order ${orderNumber} - Status: ${status}`);

    // Sanitize inputs for HTML email to prevent XSS
    const sanitizeHtml = (str: string): string => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const sanitizedName = sanitizeHtml(name);
    const sanitizedOrderNumber = sanitizeHtml(orderNumber);
    const sanitizedMessage = message ? sanitizeHtml(message) : undefined;
    const sanitizedTrackingNumber = trackingNumber ? sanitizeHtml(trackingNumber) : undefined;
    const sanitizedStatus = sanitizeHtml(status);

    const statusMessage = statusMessages[status] || `Your order status has been updated to: ${sanitizedStatus}`;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Lecrafto International <onboarding@resend.dev>",
        to: [email],
        subject: `Order Update - ${sanitizedOrderNumber} - ${sanitizedStatus.charAt(0).toUpperCase() + sanitizedStatus.slice(1)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #5C3317 100%); padding: 30px; text-align: center;">
              <h1 style="color: #F5E6D3; margin: 0;">Lecrafto International</h1>
            </div>
            
            <div style="padding: 30px; background: #fff;">
              <h2 style="color: #5C3317;">Order Update for ${sanitizedName}</h2>
              
              <div style="background: #F5E6D3; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #5C3317; font-size: 14px;">Order Number</p>
                <p style="margin: 5px 0 0 0; color: #5C3317; font-size: 24px; font-weight: bold;">${sanitizedOrderNumber}</p>
              </div>
              
              <div style="background: ${status === 'delivered' ? '#22c55e' : status === 'cancelled' ? '#ef4444' : '#8B4513'}; color: #fff; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; text-transform: capitalize;">${sanitizedStatus}</p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">${statusMessage}</p>
              
              ${sanitizedMessage ? `
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0; color: #666;">${sanitizedMessage}</p>
                </div>
              ` : ""}
              
              ${sanitizedTrackingNumber ? `
                <p style="color: #666;"><strong>Tracking Number:</strong> <span style="font-family: monospace; background: #f0f0f0; padding: 3px 8px; border-radius: 4px;">${sanitizedTrackingNumber}</span></p>
              ` : ""}
              
              ${estimatedDelivery ? `
                <p style="color: #666;"><strong>Estimated Delivery:</strong> ${new Date(estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              ` : ""}
              
              <p style="color: #666; line-height: 1.6; margin-top: 30px;">
                Track your order anytime at:<br>
                <a href="https://lecrafto.lovable.app/track-order" style="color: #8B4513;">Track Your Order</a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center;">
                Lecrafto International<br>
                1175 E Prashik Chowk, Haripur Road, Goanbhag, Sangli - 416416<br>
                Email: lecraftointernational2@gmail.com<br>
                Phone: Sumit Jadhav - 8308257226
              </p>
            </div>
          </div>
        `,
      }),
    });

    const emailData = await emailRes.json();
    console.log("Email sent for order update:", emailData);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-order-update function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
