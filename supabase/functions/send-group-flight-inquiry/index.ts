import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const {
    from_city,
    to_city,
    departure_date,
    return_date,
    passenger_count,
    trip_type,
    contact_email,
    contact_phone,
  } = await req.json();

  const brevoApiKey = Deno.env.get("BREVO_API_KEY");
  const adminEmail = Deno.env.get("ADMIN_EMAIL");
  if (!adminEmail || !adminEmail.includes("@")) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid admin email" }),
      { status: 500, headers: corsHeaders },
    );
  }

  const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": brevoApiKey!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Marhaba Haji", email: contact_email },
      to: [{ email: adminEmail, name: "Admin" }],
      subject: "New Group Flight Inquiry",
      htmlContent: `
        <h2>New Group Flight Inquiry</h2>
        <ul>
          <li><b>From:</b> ${from_city}</li>
          <li><b>To:</b> ${to_city}</li>
          <li><b>Departure Date:</b> ${departure_date}</li>
          <li><b>Return Date:</b> ${return_date || "N/A"}</li>
          <li><b>Passengers:</b> ${passenger_count}</li>
          <li><b>Trip Type:</b> ${trip_type}</li>
          <li><b>Contact Email:</b> ${contact_email}</li>
          <li><b>Contact Phone:</b> ${contact_phone}</li>
        </ul>
      `,
    }),
  });

  if (emailRes.ok) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } else {
    const error = await emailRes.text();
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
