"use client";

import { useState } from "react";

function getParts(result: string) {
  return {
    score: result.match(/(\d+)点/)?.[1] || "--",

    good:
      result.match(
        /【良いところ】([\s\S]*?)【改善/
      )?.[1] || "",

    improve:
      result.match(
        /【改善点】([\s\S]*?)【タイトル案】/
      )?.[1] ||

      result.match(
        /【改善ポイント】([\s\S]*?)【タイトル案】/
      )?.[1] ||

      "",

    title:
      result.match(
        /【タイトル案】([\s\S]*?)【人気キャスト風改善例】/
      )?.[1] || "",

    rewrite:
      result.match(
        /【人気キャスト風改善例】([\s\S]*)/
      )?.[1] || "",
  };
}

export default function Home() {
  const [diary, setDiary] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleScore() {
    setLoading(true);

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diary,
          type: "彼女感型",
        }),
      });

      const data = await res.json();

      console.log(data);

      setResult(data.result);

    } catch (error) {
      console.error(error);

      setResult("エラー");
    }

    setLoading(false);
  }

  const parts = getParts(result);

  return (
    <main
      style={{
        background: "#111",
        minHeight: "100vh",
        color: "#fff",
        padding: "30px",
      }}
    >
      <h1>写メ日記AIスコアラー</h1>

      <textarea
        value={diary}
        onChange={(e) => setDiary(e.target.value)}
        placeholder="ここに日記入力"
        style={{
          width: "100%",
          height: "200px",
          marginTop: "20px",
          padding: "20px",
          background: "#222",
          color: "#fff",
        }}
      />

      <button
        onClick={handleScore}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "20px",
          borderRadius: "20px",
          border: "none",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {loading ? "AI採点中..." : "AI採点する"}
      </button>

      <div style={{ marginTop: "30px" }}>
        <h2>総合スコア</h2>
        <p>{parts.score}点</p>

        <h2>良いところ</h2>
        <pre>{parts.good}</pre>

        <h2>改善ポイント</h2>
        <pre>{parts.improve}</pre>

        <h2>タイトル案</h2>
        <pre>{parts.title}</pre>

        <h2>改善例</h2>
        <pre>{parts.rewrite}</pre>
      </div>
    </main>
  );
}
