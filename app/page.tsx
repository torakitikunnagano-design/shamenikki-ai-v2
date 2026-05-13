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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        castName,
        diary,
      }),
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "white",
        padding: "24px",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "24px" }}>
        写メ日記AI採点
      </h1>

      <input
        value={castName}
        onChange={(e) => setCastName(e.target.value)}
        placeholder="キャスト名"
        style={{
          width: "100%",
          padding: "14px",
          marginBottom: "16px",
          borderRadius: "12px",
          border: "1px solid #333",
          background: "#1f1f1f",
          color: "white",
        }}
      />

      <textarea
        value={diary}
        onChange={(e) => setDiary(e.target.value)}
        placeholder="写メ日記本文を入力"
        style={{
          width: "100%",
          minHeight: "240px",
          padding: "14px",
          marginBottom: "16px",
          borderRadius: "12px",
          border: "1px solid #333",
          background: "#1f1f1f",
          color: "white",
        }}
      />

      <button
        onClick={handleScore}
        disabled={loading}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "12px",
          border: "none",
          background: "#00ff99",
          color: "#111",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        {loading ? "採点中..." : "AI採点する"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            borderRadius: "16px",
            background: "#1f1f1f",
            whiteSpace: "pre-wrap",
          }}
        >
          {result}
        </div>
      )}
    </main>
  );
}
