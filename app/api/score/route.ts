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

    const { data: settings } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .single();

    const minTextLength = settings?.min_text_length || 100;
    const textLength = diary.length;
    const isTextShort = textLength < minTextLength;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `
あなたは超一流の風俗店プロデューサーです。

以下の写メ日記を分析してください。

ただし、保証条件として最低文字数があります。

【保証条件】
最低文字数：${minTextLength}文字
今回の文字数：${textLength}文字
文字数不足：${isTextShort ? "あり" : "なし"}

文字数不足がある場合は、
「保証対象外の可能性があります」と必ず改善点に入れてください。

必ず下記フォーマットで返答してください。

【返答フォーマット】

総合点：○○点

保証条件チェック
・文字数：○○文字
・最低文字数：○○文字
・判定：達成 / 文字数不足

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
      return Response.json({
        result: `Supabase保存エラー：${error.message}`,
      });
    }

    return Response.json({
      result,
    });
  } catch (error: any) {
    return Response.json({
      result: `エラーが発生しました：${error.message}`,
    });
  }
}
