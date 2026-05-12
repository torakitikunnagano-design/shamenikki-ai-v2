"use client";

import { useState } from "react";

function getParts(result: string) {
  return {
    score: result.match(/(\d+)点/)?.[1] || "--",

    good:
      result.match(/【良いところ】([\s\S]*?)【改善点】/)?.[1] ||
      result.match(/【良いところ】([\s\S]*?)【改善ポイント】/)?.[1] ||
      "",

    improve:
      result.match(/【改善点】([\s\S]*?)【タイトル案】/)?.[1] ||
      result.match(/【改善ポイント】([\s\S]*?)【タイトル案】/)?.[1] ||
      "",

    title:
      result.match(/【タイトル案】([\s\S]*?)【人気キャスト風改善例】/)?.[1] ||
      "",

    rewrite:
      result.match(/【人気キャスト風改善例】([\s\S]*)/)?.[1] || "",
  };
}

export default function Home() {
  const [diary, setDiary] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("彼女感型");

  async function handleScore() {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diary,
          type,
        }),
      });

      const data = await res.json();
      setResult(data.result || "AI採点に失敗しました");
    } catch (error) {
      console.error(error);
      setResult("エラーが発生しました");
    }

    setLoading(false);
  }

  const parts = getParts(result);

  const types = ["彼女感型", "色恋型", "清楚型", "初心者向け"];

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <p style={styles.sub}>SHAMENIKKI AI SCORER</p>

        <h1 style={styles.title}>写メ日記AIスコアラー</h1>

        <p style={styles.text}>
          AIが写メ日記を100点満点で採点し、改善点・タイトル案・人気キャスト風の改善例まで作成します。
        </p>

        <div style={styles.typeArea}>
          {types.map((item) => (
            <button
              key={item}
              onClick={() => setType(item)}
              style={{
                ...styles.typeButton,
                background: type === item ? "#f5c542" : "#1f1f1f",
                color: type === item ? "#111" : "#fff",
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <textarea
          value={diary}
          onChange={(e) => setDiary(e.target.value)}
          placeholder="ここに写メ日記本文を入力..."
          style={styles.textarea}
        />

        <button onClick={handleScore} disabled={loading} style={styles.button}>
          {loading ? "AI採点中..." : "AI採点する"}
        </button>

        {result && (
          <div style={styles.resultArea}>
            <div style={styles.scoreBox}>
              <p style={styles.label}>総合スコア</p>
              <p style={styles.score}>{parts.score}点</p>
            </div>

            <div style={styles.grid}>
              <ResultBox title="良いところ" content={parts.good} />
              <ResultBox title="改善ポイント" content={parts.improve} />
            </div>

            <ResultBox title="タイトル案" content={parts.title} />
            <ResultBox title="人気キャスト風 改善例" content={parts.rewrite} />
          </div>
        )}
      </section>
    </main>
  );
}

function ResultBox({ title, content }: { title: string; content: string }) {
  return (
    <div style={styles.resultBox}>
      <h2 style={styles.boxTitle}>{title}</h2>
      <pre style={styles.pre}>{content}</pre>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #3a2a00 0%, #111 35%, #050505 100%)",
    color: "#fff",
    padding: "24px",
    fontFamily:
      "Arial, 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif",
  },

  card: {
    maxWidth: "980px",
    margin: "0 auto",
    background: "rgba(20,20,20,0.92)",
    border: "1px solid rgba(245,197,66,0.45)",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 0 40px rgba(245,197,66,0.18)",
  },

  sub: {
    color: "#f5c542",
    letterSpacing: "2px",
    fontSize: "13px",
    fontWeight: "bold",
  },

  title: {
    fontSize: "34px",
    margin: "8px 0 12px",
  },

  text: {
    color: "#ddd",
    lineHeight: "1.8",
  },

  typeArea: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    margin: "24px 0",
  },

  typeButton: {
    border: "1px solid #f5c542",
    borderRadius: "999px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  textarea: {
    width: "100%",
    minHeight: "260px",
    background: "#111",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "18px",
    padding: "18px",
    fontSize: "16px",
    lineHeight: "1.8",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    marginTop: "18px",
    padding: "18px",
    border: "none",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #f5c542, #ff7a00, #ff2d75)",
    color: "#111",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  resultArea: {
    marginTop: "28px",
  },

  scoreBox: {
    background: "linear-gradient(135deg, #2b2208, #111)",
    border: "1px solid #f5c542",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "18px",
  },

  label: {
    color: "#f5c542",
    fontWeight: "bold",
  },

  score: {
    fontSize: "54px",
    fontWeight: "bold",
    margin: 0,
    color: "#f5c542",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },

  resultBox: {
    background: "#151515",
    border: "1px solid #333",
    borderRadius: "18px",
    padding: "20px",
    marginTop: "18px",
  },

  boxTitle: {
    color: "#f5c542",
    marginTop: 0,
  },

  pre: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.8",
    fontSize: "15px",
    fontFamily: "inherit",
  },
};
