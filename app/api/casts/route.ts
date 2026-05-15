import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("casts")
    .select("*");

  if (error) {
    return Response.json([]);
  }

  return Response.json(data || []);
}

export async function POST(request: Request) {
  const { name, is_active } = await request.json();

  const { error } = await supabase
    .from("casts")
    .update({
      is_active,
    })
    .eq("name", name);

  if (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }

  return Response.json({
    success: true,
  });
}
