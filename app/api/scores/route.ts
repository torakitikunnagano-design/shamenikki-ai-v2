import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return Response.json({
      error: error.message,
    });
  }

  return Response.json(data);
}
