"use client";

import { useEffect, useState } from "react";

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
  const [castName, setCastName] = useState("");
  const [diary, setDiary] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("彼女感型");
  const [histories, setHistories] = useState<any[]>([]);

  async function loadHistories() {
    try {
      const res = await fetch("/api/score");
      const data = await res.json();
      setHistories(data.scores || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadHistories();
  }, []);

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
          castName,
        }),
      });

      const data = await res.json();
      setResult(data.result || "AI採点に失敗しました");
      await loadHistories();
    } catch (error) {
      console.error(error);
      setResult("エラーが発生しました");
    }

    setLoading(false);
  }

  const parts = getParts(result);
  const types = ["彼女感型", "色恋型", "清楚型", "初心者向け"];

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}
        body{margin:0;background:#050505;}
        .main{
          min-height:100vh;
          background:radial-gradient(circle at top,#3a2a00 0%,#111 35%,#050505 100%);
          color:#fff;
          padding:14px;
          font-family:Arial,'Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif;
        }
        .card{
          max-width:980px;
          margin:0 auto;
          background:rgba(20,20,20,0.95);
          border:1px solid rgba(245,197,66,0.45);
          border-radius:24px;
          padding:18px;
          box-shadow:0 0 40px rgba(245,197,66,0.18);
        }
        .sub{color:#f5c542;letter-spacing:2px;font-size:12px;font-weight:bold;}
        .title{font-size:34px;margin:8px 0 10px;line-height:1.3;}
        .text{color:#ddd;line-height:1.8;font-size:14px;}
        .input{
          width:100%;
          background:#111;
          color:#fff;
          border:1px solid #555;
          border-radius:14px;
          padding:14px;
          font-size:15px;
          margin-top:18px;
        }
        .typeArea{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0;}
        .typeButton{
          border:1px solid #f5c542;
          border-radius:999px;
          padding:10px 16px;
          cursor:pointer;
          font-weight:bold;
          font-size:13px;
        }
        .textarea{
          width:100%;
          min-height:240px;
          background:#111;
          color:#fff;
          border:1px solid #555;
          border-radius:18px;
          padding:16px;
          font-size:15px;
          line-height:1.8;
          resize:none;
        }
        .button{
          width:100%;
          margin-top:18px;
          padding:18px;
          border:none;
          border-radius:999px;
          background:linear-gradient(90deg,#f5c542,#ff7a00,#ff2d75);
          color:#111;
          font-size:18px;
          font-weight:bold;
          cursor:pointer;
        }
        .resultArea{margin-top:28px;}
        .scoreBox{
          background:linear-gradient(135deg,#2b2208,#111);
          border:1px solid #f5c542;
          border-radius:20px;
          padding:24px;
          margin-bottom:18px;
          text-align:center;
        }
        .label{color:#f5c542;font-weight:bold;margin-bottom:10px;}
        .score{font-size:64px;font-weight:bold;margin:0;color:#f5c542;line-height:1;}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
        .resultBox{
          background:#151515;
          border:1px solid #333;
          border-radius:18px;
          padding:18px;
          margin-top:18px;
        }
        .boxTitle{color:#f5c542;margin-top:0;margin-bottom:16px;font-size:20px;}
        .pre{white-space:pre-wrap;line-height:1.9;font-size:14px;font-family:inherit;margin:0;}
        .historyArea{margin-top:40px;}
        .historyTitle{color:#f5c542;margin-bottom:20px;}
        .historyCard{
          display:flex;
          gap:14px;
          align-items:flex-start;
          background:#111;
          border:1px solid #333;
          border-radius:16px;
          padding:16px;
          margin-bottom:14px;
        }
        .historyScore{
          font-size:30px;
          font-weight:bold;
          color:#f5c542;
          min-width:80px;
        }
        .castName{
          color:#f5c542;
          font-weight:bold;
          margin:0 0 8px;
        }
        .historyDiary{
          margin:0;
          line-height:1.8;
          font-size:14px;
          word-break:break-word;
        }
        .historyDate{opacity:0.6;font-size:11px;margin-top:10px;}
        @media(max-width:768px){
          .main{padding:10px;}
          .card{padding:16px;border-radius:18px;}
          .title{font-size:26px;}
          .textarea{min-height:200px;font-size:14px;}
          .button{padding:16px;font-size:16px;}
          .score{font-size:48px;}
          .grid{grid-template-columns:1fr;}
          .historyCard{flex-direction:column;}
          .historyScore{min-width:auto;font-size:26px;}
        }
      `}</style>

      <main className="main">
        <section className="card">
          <p className="sub">SHAMENIKKI AI SCORER</p>
          <h1 className="title">写メ日記AIスコアラー</h1>

          <p className="text">
            AIが写メ日記を100点満点で採点し、改善点・タイトル案・改善例まで作成します。
          </p>

          <input
            value={castName}
            onChange={(e) => setCastName(e.target.value)}
            placeholder="キャスト名を入力"
            className="input"
          />

          <div className="typeArea">
            {types.map((item) => (
              <button
                key={item}
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

          <textarea
            value={diary}
            onChange={(e) => setDiary(e.target.value)}
            placeholder="ここに写メ日記本文を入力..."
            className="textarea"
          />

          <button onClick={handleScore} disabled={loading} className="button">
            {loading ? "AI採点中..." : "AI採点する"}
          </button>
          <div key={index} className="historyCard">
  <div className="historyScore">{past.score}点</div>
{history.map((item, index) => (
  <div key={index} className="historyCard">
    <div className="historyScore">
      {item.score || "85"}点
    </div>

    <div>
      <p className="text-sm text-yellow-400">
        キャスト名：{item.cast_name || "未入力"}
      </p>

      <p className="historyDiary">{item.diary}</p>

      <p className="historyDate">{item.created_at}</p>
    </div>
  </div>
))}

     
