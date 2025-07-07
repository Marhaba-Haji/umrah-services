import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";
import { hash } from "bcrypt";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  try {
    const { user_id, new_password } = await req.json();
    if (!user_id || !new_password) {
      return new Response(
        JSON.stringify({ error: "Missing user_id or new_password" }),
        { status: 400 },
      );
    }
    // Hash the password securely
    const password_hash = await hash(new_password, 10);
    // Update the user_roles table
    const { error } = await supabase
      .from("user_roles")
      .update({ password_hash })
      .eq("user_id", user_id);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }
});
