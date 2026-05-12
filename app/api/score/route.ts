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
    const { diary, castName } = await request.json();

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `以下の写メ日記を100点満点で採点してください。

【キャスト名】
${castName || "未入力"}

【写メ日記】
${diary}

以下の形式で返してください。

点数：
良い点：
改善点：
タイトル案：
人気キャスト風の改善例：`,
    });

    const result = response.output_text;

    await supabase.from("scores").insert({
      diary,
      result,
      cast_name: castName,
    });

    return Response.json({
      result,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        result: "エラーが発生しました",
      },
      { status: 500 }
    );
  }
}
