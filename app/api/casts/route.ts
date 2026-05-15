import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("casts")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return Response.json([]);
  }

  return Response.json(data);
}
