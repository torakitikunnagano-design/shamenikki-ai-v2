import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .single();

  return Response.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { daily_post_goal, repeat_limit_minutes } =
    body;

  const { data: existing } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .single();

  if (existing) {
    await supabase
      .from("settings")
      .update({
        daily_post_goal,
        repeat_limit_minutes,
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("settings").insert({
      daily_post_goal,
      repeat_limit_minutes,
    });
  }

  return Response.json({
    success: true,
  });
}
