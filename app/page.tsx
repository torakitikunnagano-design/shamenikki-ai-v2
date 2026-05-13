"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./globals.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [castName, setCastName] = useState("");
  const [diary, setDiary] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [type, setType] = useState("彼女感");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await fetch("/api/his");

      const data = await res.json();

      setHistory(data.history || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleScore() {
    if (!diary.trim()) {
      alert("写メ日記を入力してください");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diary,
          castName,
          type,
        }),
      });

      const data = await res.json();

      setResult(data.result || "");

      await loadHistory();
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  function getScore(text: string) {
    const match = text?.match(/(\d{1,3})点/);

    return match ? match[1] : "85";
  }

  function getSection(text: string, label: string) {
    if (!text) return "";

    const regex = new RegExp(
      `${label}[：:](.*?)(?=\\n\\S+[：:]|$)`,
      "s"
    );

    const match = text.match(regex);

    return match ? match[1].trim() : "";
  }

  return (
    <main className="main">
      <section className="card">
        <h1 className="title">写メ日記 AIスコアラー</h1>

        <p className="subtitle">
          写メ日記をAIが採点し、改善点と人気キャスト風の例文を作ります。
        </p>

        <label className="label">キャスト名</label>

        <input
          className="input"
          value={castName}
          onChange={(e) => setCastName(e.target.value)}
          placeholder="例：さくら"
        />

        <div className="typeButtons">
          {["彼女感", "色恋型", "清楚型", "初心者向け"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setType(item)}
              className="typeButton"
              style={{
                background: type === item ? "#f5c542" : "#1f1f1f",
                color: type === item ? "#111" : "#fff",
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="label">写メ日記本文</label>

        <textarea
          className="textarea"
          value={diary}
          onChange={(e) => setDiary(e.target.value)}
          placeholder="ここに写メ日記本文を入力..."
        />

        <button
          className="button"
          onClick={handleScore}
          disabled={loading}
        >
          {loading ? "AI採点中..." : "AI採点する"}
        </button>

        {result && (
          <section className="resultArea">
            <div className="scoreBox">
              <p className="scoreLabel">総合スコア</p>

              <p className="score">
                {getScore(result)}点
              </p>
            </div>

            <div className="resultBox">
              <h3>良いところ</h3>

              <p>
                {getSection(result, "良い点")}
              </p>
            </div>

            <div className="resultBox">
              <h3>改善ポイント</h3>

              <p>
                {getSection(result, "改善点")}
              </p>
            </div>

            <div className="resultBox">
              <h3>タイトル案</h3>

              <p>
                {getSection(result, "タイトル案")}
              </p>
            </div>

            <div className="resultBox">
              <h3>人気キャスト風 改善例</h3>

              <p>
                {getSection(result, "人気キャスト風の改善例")}
              </p>
            </div>
          </section>
        )}

        <section className="historySection">
          <h2 className="historyTitle">
            過去の採点履歴
          </h2>

          {history.length === 0 && (
            <p className="historyEmpty">
              まだ履歴がありません
            </p>
          )}

          {history.map((item: any) => (
            <div
              key={item.id}
              className="historyCard"
            >
              <div className="historyScore">
                {item.result?.match(/(\d{1,3})点/)?.[1] || "85"}点
              </div>

              <div>
                <p className="castName">
                  キャスト名：
                  {item.cast_name || "未入力"}
                </p>

                <p className="historyDiary">
                  {item.diary}
                </p>

                <p className="historyDate">
                  {item.created_at}
                </p>
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
