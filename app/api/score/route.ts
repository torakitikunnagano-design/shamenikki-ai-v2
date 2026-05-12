import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { diary, type } = await request.json();

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: `
あなたは写メ日記のプロ添削AIです。

以下の写メ日記を100点満点で採点してください。
タイプは「${type}」です。

必ずこの形式で返してください。

【総合スコア】
80点

【良いところ】
・

【改善点】
・

【タイトル案】
・

【人気キャスト風改善例】


本文：
${diary}
      `,
    });

    return Response.json({
      result: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        result: "AI採点に失敗しました",
      },
      { status: 500 }
    );
  }
}
export async function GET() {
  return Response.json({
    scores: [],
  });
}
