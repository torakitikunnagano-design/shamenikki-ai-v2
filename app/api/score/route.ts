import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { castName, diary } = await request.json();

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `以下の写メ日記を100点満点で採点してください。

【キャスト名】
${castName}

【入力文】
${diary}`,
    });

    const result = response.output_text;

    await supabase.from("scores").insert({
      cast_name: castName,
      diary,
      result,
    });

    return Response.json({
      result,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      result: "エラーが発生しました",
    });
  }
}
