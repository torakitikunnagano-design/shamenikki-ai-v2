"use client";

import { useState } from "react";

export default function Home() {
  const [castName, setCastName] = useState("");
  const [diary, setDiary] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleScore() {
    setLoading(true);
    setResult("");

    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ castName, diary }),
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1f3d2b 0%, #0f0f0f 45%, #050505 100%)",
        color: "white",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <p style={{ color: "#66ff99", fontWeight: "bold" }}>
          SHAMENIKKI AI SCORE
        </p>

        <h1 style={{ fontSize: "42px", marginBottom: "12px" }}>
          写メ日記AI採点
        </h1>

        <p style={{ color: "#aaa", marginBottom: "28px" }}>
          キャスト名と写メ日記を入力すると、AIが点数と改善点を分析します。
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "24px",
            padding: "22px",
            boxShadow: "0 0 40px rgba(0,255,153,0.12)",
            backdropFilter: "blur(10px)",
          }}
        >
          <input
            value={castName}
            onChange={(e) => setCastName(e.target.value)}
            placeholder="キャスト名"
            style={{
              width: "100%",
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "16px",
              border: "1px solid #333",
              background: "#151515",
              color: "white",
            }}
          />

          <textarea
            value={diary}
            onChange={(e) => setDiary(e.target.value)}
            placeholder="写メ日記本文を入力"
            style={{
              width: "100%",
              minHeight: "260px",
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "16px",
              border: "1px solid #333",
              background: "#151515",
              color: "white",
            }}
          />

          <button
            onClick={handleScore}
            disabled={loading}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "18px",
              border: "none",
              background: loading
                ? "#555"
                : "linear-gradient(90deg, #65ff9a, #00d4ff)",
              color: "#081008",
              fontWeight: "bold",
              fontSize: "18px",
              boxShadow: "0 0 24px rgba(0,255,153,0.35)",
            }}
          >
            {loading ? "採点中..." : "AI採点する"}
          </button>
        </div>

        {result && (
          <div
            style={{
              marginTop: "24px",
              padding: "22px",
              borderRadius: "22px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(0,255,153,0.3)",
              whiteSpace: "pre-wrap",
              lineHeight: "1.8",
            }}
          >
            {result}
          </div>
        )}
      </div>
    </main>
  );
}
