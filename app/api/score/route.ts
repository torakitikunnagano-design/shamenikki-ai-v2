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
      input: `
あなたは超一流の風俗店プロデューサーです。

以下の写メ日記を分析して、
必ず下記フォーマットで返答してください。

【返答フォーマット】

総合点：○○点

良い点
・
・

改善点
・
・

改善タイトル案
・
・

彼女感タイプ分析
・彼女感型
・色恋型
・癒し型

【キャスト名】
${castName}

【写メ日記】
${diary}
`,
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
