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
    const { diary, castName, type } = await request.json();

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `あなたは写メ日記の教育担当AIです。
以下の写メ日記を、100点満点で採点してください。

【キャスト名】
${castName || "未入力"}

【選択タイプ】
${type || "未選択"}

【写メ日記本文】
${diary}

必ず以下の形式で返してください。

点数：
彼女感スコア：
色恋感スコア：
清楚感スコア：
良い点：
改善点：
タイトル案：
人気キャスト風の改善例：

採点ルール：
・点数は100点満点
・彼女感スコア、色恋感スコア、清楚感スコアも100点満点
・お客様が「また会いたい」と思うかを重視
・文章の親しみやすさ、余韻、誘導力を見る
・改善点は初心者にもわかりやすく
・人気キャスト風の改善例は、そのまま写メ日記に使える文章にする`,
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
