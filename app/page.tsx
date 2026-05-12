"use client";

import { useEffect, useState } from "react";

type ScoreHistory = {
  id?: number;
  diary: string;
  result: string;
  created_at?: string;
};

function getParts(result: string) {
  return {
    score: result.match(/【総合スコア】\s*(\d+)点/)?.[1] || "--",
    good: result.match(/【良いところ】([\s\S]*?)【改善点】/)?.[1] || "",
    improve: result.match(/【改善点】([\s\S]*?)【タイトル案】/)?.[1] || "",
    title: result.match(/【タイトル案】([\s\S]*?)【人気キャスト風改善例】/)?.[1] || "",
    rewrite: result.match(/【人気キャスト風改善例】([\s\S]*)/)?.[1] || "",
  };
}

function getScoreColor(score: string) {
  const num = Number(score);

  if (num >= 90) return "#ffd700";
  if (num >= 80) return "#00ff99";
  if (num >= 70) return "#00bfff";

  return "#ff4d4d";
}

export default function Home() {
  const [diary, setDiary] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("彼女感型");
  const [histories, setHistories] = useState<ScoreHistory[]>([]);
  const [selected, setSelected] = useState<ScoreHistory | null>(null);

  async function loadHistories() {
    const res = await fetch("/api/score");
    const data = await res.json();
    setHistories(data.scores || []);
  }

  useEffect(() => {
    loadHistories();
  }, []);

  async function handleScore() {
    setLoading(true);
    setResult("");
    setSelected(null);

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

      setResult(data.result);

      await loadHistories();
    } catch (error) {
      console.error(error);
      setResult("エラーが発生しました");
    }

    setLoading(false);
  }

  const displayResult = selected ? selected.result : result;

  const parts = getParts(displayResult);

  const types = [
    "彼女感型",
    "色恋型",
    "清楚型",
    "初心者向け",
  ];

  return (
    <main className="main">
      <div className="card">
        <p className="sub">SHAMENIKKI AI SCORER</p>

        <h1 className="title">
          写メ日記AIスコアラー 🔥
        </h1>

        <p>
          AIが写メ日記を分析し、
          売れる文章へ改善します。
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          {types.map((item) => (
            <button
              key={item}
              onClick={() => setType(item)}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                background:
                  type === item ? "#ffd700" : "#222",
                color:
                  type === item ? "#000" : "#fff",
                fontWeight: "bold",
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="input-box">
          <label>日記本文</label>

          <textarea
            value={diary}
            onChange={(e) => setDiary(e.target.value)}
            placeholder="ここに写メ日記本文を入力..."
            className="textarea"
          />

          <button
            type="button"
            onClick={handleScore}
            className="button"
          >
            {loading ? "AI採点中..." : "AI採点する"}
          </button>
        </div>

        {displayResult && (
          <>
            {selected && (
              <div className="result">
                <h2>選択した過去の日記</h2>

                <p>{selected.diary}</p>
              </div>
            )}

            <div className="boxes">
              <div className="box">
                <h2>総合スコア</h2>

                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: "bold",
                    color: getScoreColor(parts.score),
                    marginTop: "10px",
                  }}
                >
                  {parts.score}点
                </div>
              </div>

              <div className="box">
                <h2>良いところ</h2>

                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.7",
                  }}
                >
                  {parts.good}
                </pre>
              </div>

              <div className="box">
                <h2>改善ポイント</h2>

                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.7",
                  }}
                >
                  {parts.improve}
                </pre>
              </div>
            </div>

            <div className="result">
              <h2>タイトル案</h2>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7",
                }}
              >
                {parts.title}
              </pre>
            </div>

            <div className="result">
              <h2>人気キャスト風 改善例</h2>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.9",
                }}
              >
                {parts.rewrite}
              </pre>
            </div>
          </>
        )}

        <div className="result">
          <h2>過去の採点履歴</h2>

          {histories.length === 0 ? (
            <p>まだ履歴はありません。</p>
          ) : (
            histories.map((item, index) => {
              const past = getParts(item.result);

              return (
                <button
                  key={item.id || index}
                  onClick={() => setSelected(item)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "15px",
                    marginTop: "12px",
                    background: "#111",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <h3
                    style={{
                      color: getScoreColor(past.score),
                    }}
                  >
                    {past.score}点
                  </h3>

                  <p style={{ opacity: 0.8 }}>
                    {item.diary.length > 60
                      ? item.diary.slice(0, 60) + "..."
                      : item.diary}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}