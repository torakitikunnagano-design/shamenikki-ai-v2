import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { diary } = await request.json();

    const response = await client.responses.create({
      model: "gpt-5.2",
      input: `
この写メ日記を100点満点で採点してください。

■ 必ずこの形式で返してください

点数：
良いところ：
改善点：
タイトル案：

本文：
${diary}
      `,
    });

    return Response.json({
      result: response.output_text,
    });

  } catch (error) {
    return Response.json({
      error: "AI採点に失敗しました"
    });
  }
}
