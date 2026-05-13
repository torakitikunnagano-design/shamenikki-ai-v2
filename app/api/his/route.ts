import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("id", { ascending: false })
    .limit(10);

  if (error) {
    console.error(error);
    return Response.json({ history: [] });
  }

  return Response.json({ history: data || [] });
}
