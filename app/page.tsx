"use client";

import { useState } from "react";

function pickSection(text: string, title: string) {
  const start = text.indexOf(title);
  if (start === -1) return "";

  const nextTitles = [
    "総合点",
    "保証条件チェック",
    "良い点",
    "改善点",
    "改善タイトル案",
    "彼女感タイプ分析",
  ];

  let end = text.length;

  for (const next of nextTitles) {
    const nextIndex = text.indexOf(next, start + title.length);
    if (nextIndex !== -1 && nextIndex < end) end = nextIndex;
  }

  return text.slice(start, end).trim();
}

export default function Home() {
  const [castName, setCastName] = useState("");
  const [diary, setDiary] = useState("");
  const [hasImage, setHasImage] = useState(false);
  const [workStart, setWorkStart] = useState("");
  const [workEnd, setWorkEnd] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleScore() {
    setLoading(true);
    setResult("");

    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        castName,
        diary,
        hasImage,
        workStart,
        workEnd,
      }),
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  }

  const sections = [
    { label: "総合点", text: pickSection(result, "総合点") },
    { label: "保証条件チェック", text: pickSection(result, "保証条件チェック") },
    { label: "良い点", text: pickSection(result, "良い点") },
    { label: "改善点", text: pickSection(result, "改善点") },
    { label: "改善タイトル案", text: pickSection(result, "改善タイトル案") },
    { label: "タイプ分析", text: pickSection(result, "彼女感タイプ分析") },
  ];

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
          キャスト名・本文・画像有無・出勤時間を入力すると、AIが保証条件と改善点を分析します。
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "24px",
            padding: "22px",
            boxShadow: "0 0 40px rgba(0,255,153,0.12)",
          }}
        >
          <input
            value={castName}
            onChange={(e) => setCastName(e.target.value)}
            placeholder="キャスト名"
            style={inputStyle}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <input
              type="time"
              value={workStart}
              onChange={(e) => setWorkStart(e.target.value)}
              style={inputStyle}
            />

            <input
              type="time"
              value={workEnd}
              onChange={(e) => setWorkEnd(e.target.value)}
              style={inputStyle}
            />
          </div>

          <textarea
            value={diary}
            onChange={(e) => setDiary(e.target.value)}
            placeholder="写メ日記本文を入力"
            style={{
              ...inputStyle,
              minHeight: "260px",
            }}
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#aaa",
              marginBottom: "16px",
            }}
          >
            <input
              type="checkbox"
              checked={hasImage}
              onChange={(e) => setHasImage(e.target.checked)}
            />
            画像あり
          </label>

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
            }}
          >
            {loading ? "採点中..." : "AI採点する"}
          </button>
        </div>

        {result && (
          <div style={{ marginTop: "24px", display: "grid", gap: "16px" }}>
            {sections.map((section) => (
              <div
                key={section.label}
                style={{
                  padding: "20px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(0,255,153,0.25)",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.8",
                }}
              >
                <h2 style={{ marginBottom: "10px", color: "#66ff99" }}>
                  {section.label}
                </h2>
                <p>{section.text || "取得できませんでした"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "16px",
  border: "1px solid #333",
  background: "#151515",
  color: "white",
};
