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

    if (!diary) {
      return Response.json({
        result: "写メ日記本文を入力してください",
      });
    }

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
${castName || "未設定"}

【写メ日記】
${diary}
`,
    });

    const result = response.output_text;

    const { error } = await supabase.from("scores").insert({
      cast_name: castName || "未設定",
      diary,
      result,
    });

    if (error) {
      console.error(error);

      return Response.json({
        result: `Supabase保存エラー：${error.message}`,
      });
    }

    return Response.json({
      result,
    });
  } catch (error: any) {
    console.error(error);

    return Response.json({
      result: `エラーが発生しました：${error.message}`,
    });
  }
}
