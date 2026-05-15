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
    const { castName, diary, hasImage, workStart, workEnd } =
      await request.json();

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
    const imageRequired = settings?.image_required === true;
    const beforeWorkMin = settings?.before_work_min || 60;
    const afterWorkMin = settings?.after_work_min || 60;

    const textLength = diary.length;
    const shortageText = Math.max(minTextLength - textLength, 0);
    const isTextShort = textLength < minTextLength;
    const isImageMissing = imageRequired && !hasImage;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `
あなたは超一流の風俗店プロデューサーです。

以下の写メ日記を分析してください。
目的は「保証条件を守りながら、女の子が無理なく投稿品質を上げること」です。

【保証条件】
最低文字数：${minTextLength}文字
今回の文字数：${textLength}文字
不足文字数：${shortageText}文字
文字数不足：${isTextShort ? "あり" : "なし"}

画像必須：${imageRequired ? "あり" : "なし"}
画像あり：${hasImage ? "あり" : "なし"}
画像不足：${isImageMissing ? "あり" : "なし"}

出勤前投稿ルール：出勤${beforeWorkMin}分前まで
退勤後投稿ルール：退勤${afterWorkMin}分前後

出勤時間：${workStart || "未入力"}
退勤時間：${workEnd || "未入力"}

【重要ルール】
・文字数不足がある場合は「保証対象外の可能性があります」と必ず書く
・画像不足がある場合は「画像不足のため保証条件未達の可能性があります」と必ず書く
・「短文でもOK」「1本だけでもOK」のように保証条件を軽く扱う表現は禁止
・女の子を責めず、スタッフがそのまま伝えられる優しい表現にする
・保証改善提案では、保証達成に必要な具体的行動を出す

必ず下記フォーマットで返答してください。

総合点：○○点

保証条件チェック
・文字数：○○文字
・最低文字数：○○文字
・不足文字数：○○文字
・文字数判定：達成 / 文字数不足
・画像必須：あり / なし
・画像判定：達成 / 画像不足
・出勤時間：○○
・退勤時間：○○

保証改善提案
・文字数不足の場合：自然に追記できる文章案を1〜2個出す
・画像不足の場合：追加すべき画像の内容を提案する
・保証条件にひっかかる場合：何を直せば保証達成に近づくかを書く

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
      posted_at: new Date().toISOString(),
      work_start: workStart || null,
      work_end: workEnd || null,
      has_image: hasImage === true,
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
