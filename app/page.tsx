"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./globals.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ngWords = [
  "暇",
  "ひま",
  "誰でも",
  "適当",
  "だるい",
  "疲れた",
  "病んだ",
  "最悪",
  "めんどくさい",
  "来なくていい",
];

const positiveWords = [
  "ありがとう",
  "嬉しい",
  "楽しい",
  "会える",
  "楽しみ",
  "優しい",
  "癒し",
  "幸せ",
  "また",
  "大好き",
  "お兄さん",
  "待ってる",
  "ぬくぬく",
  "ぎゅ",
  "笑顔",
  "ドキドキ",
];

export default function Home() {
  const [castName, setCastName] = useState("");
  const [diary, setDiary] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [titleLoading, setTitleLoading] = useState(false);
  const [aiTitle, setAiTitle] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [type, setType] = useState("彼女感");
  const [selectedCast, setSelectedCast] = useState("");

  const foundNgWords = ngWords.filter((word) => diary.includes(word));

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await fetch("/api/his", {
        cache: "no-store",
      });

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

  async function handleTitleGenerate() {
    if (!diary.trim()) {
      alert("写メ日記本文を入力してください");
      return;
    }

    setTitleLoading(true);
    setAiTitle("");

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diary: `以下の写メ日記から、お客様がクリックしたくなるタイトルを5個だけ作ってください。

【条件】
・短く
・可愛く
・彼女感がある
・絵文字は使いすぎない
・番号付きで出す
・本文の採点は不要

【写メ日記】
${diary}`,
          castName,
          type,
        }),
      });

      const data = await res.json();

      setAiTitle(data.result || "");
    } catch (error) {
      console.error(error);
      alert("タイトル生成でエラーが発生しました");
    } finally {
      setTitleLoading(false);
    }
  }

  function getScore(text: string) {
    const match = text?.match(/(\d{1,3})点/);
    return match ? match[1] : "85";
  }

  function getNamedScore(text: string, label: string) {
    if (!text) return "0";

    const regex = new RegExp(`${label}[：:]\\s*(\\d{1,3})`);
    const match = text.match(regex);

    return match ? match[1] : "0";
  }

  function getScoreNumber(text: string) {
    return Number(getScore(text));
  }

  function getScoreClass(scoreText: string) {
    const score = Number(getScore(scoreText));

    if (score >= 90) return "scoreHigh";
    if (score >= 70) return "scoreMiddle";
    return "scoreLow";
  }

  function getPointClass(score: string) {
    const num = Number(score);

    if (num >= 90) return "scoreHigh";
    if (num >= 70) return "scoreMiddle";
    return "scoreLow";
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

  const girlfriendScore = getNamedScore(result, "彼女感スコア");
  const loveScore = getNamedScore(result, "色恋感スコア");
  const cleanScore = getNamedScore(result, "清楚感スコア");

  const ranking = Object.values(
    history.reduce((acc: any, item: any) => {
      const name = item.cast_name || "未入力";
      const score = getScoreNumber(item.result);

      if (!acc[name]) {
        acc[name] = {
          name,
          total: 0,
          count: 0,
        };
      }

      acc[name].total += score;
      acc[name].count += 1;

      return acc;
    }, {})
  )
    .map((item: any) => ({
      name: item.name,
      average: Math.round(item.total / item.count),
      count: item.count,
    }))
    .sort((a: any, b: any) => b.average - a.average);

  const castNames = Array.from(
    new Set(history.map((item) => item.cast_name || "未入力"))
  );

  const activeCast = selectedCast || castNames[0] || "";

  const growthData = history
    .filter((item) => (item.cast_name || "未入力") === activeCast)
    .slice()
    .reverse()
    .slice(-10)
    .map((item) => ({
      id: item.id,
      score: getScoreNumber(item.result),
      date: item.created_at,
    }));

  const wordRanking = positiveWords
    .map((word) => {
      const count = history.reduce((total, item) => {
        const diaryText = item.diary || "";
        const resultText = item.result || "";
        const fullText = diaryText + resultText;

        return fullText.includes(word) ? total + 1 : total;
      }, 0);

      return {
        word,
        count,
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const ngWordRanking = ngWords
    .map((word) => {
      const count = history.reduce((total, item) => {
        const diaryText = item.diary || "";
        return diaryText.includes(word) ? total + 1 : total;
      }, 0);

      return {
        word,
        count,
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

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

        {foundNgWords.length > 0 && (
          <div className="ngBox">
            <p className="ngTitle">⚠ NGワード注意</p>

            <p className="ngText">
              見つかった言葉：{foundNgWords.join(" / ")}
            </p>

            <p className="ngText">
              印象が弱く見えたり、ネガティブに伝わる可能性があります。
            </p>
          </div>
        )}

        <button
          className="button"
          onClick={handleTitleGenerate}
          disabled={titleLoading}
          type="button"
        >
          {titleLoading ? "タイトル生成中..." : "タイトルだけAI生成"}
        </button>

        {aiTitle && (
          <div className="resultBox">
            <h3>AIタイトル案</h3>
            <p>{aiTitle}</p>
          </div>
        )}

        <button className="button" onClick={handleScore} disabled={loading}>
          {loading ? "AI採点中..." : "AI採点する"}
        </button>

        {result && (
          <section className="resultArea">
            <div className="scoreBox">
              <p className="scoreLabel">総合スコア</p>

              <p className={`score ${getScoreClass(result)}`}>
                {getScore(result)}点
              </p>
            </div>

            <div className="feelingGrid">
              <div className={`feelingBox ${getPointClass(girlfriendScore)}`}>
                <p className="feelingLabel">彼女感</p>
                <p className="feelingScore">{girlfriendScore}点</p>
              </div>

              <div className={`feelingBox ${getPointClass(loveScore)}`}>
                <p className="feelingLabel">色恋感</p>
                <p className="feelingScore">{loveScore}点</p>
              </div>

              <div className={`feelingBox ${getPointClass(cleanScore)}`}>
                <p className="feelingLabel">清楚感</p>
                <p className="feelingScore">{cleanScore}点</p>
              </div>
            </div>

            <div className="resultBox">
              <h3>良いところ</h3>
              <p>{getSection(result, "良い点")}</p>
            </div>

            <div className="resultBox">
              <h3>改善ポイント</h3>
              <p>{getSection(result, "改善点")}</p>
            </div>

            <div className="resultBox">
              <h3>タイトル案</h3>
              <p>{getSection(result, "タイトル案")}</p>
            </div>

            <div className="resultBox">
              <h3>人気キャスト風 改善例</h3>
              <p>{getSection(result, "人気キャスト風の改善例")}</p>
            </div>
          </section>
        )}

        <section className="historySection">
          <h2 className="historyTitle">キャスト別 平均点ランキング</h2>

          {ranking.length === 0 && (
            <p className="historyEmpty">まだランキングがありません</p>
          )}

          {ranking.map((item: any, index: number) => (
            <div key={item.name} className="historyCard">
              <div
                className={`historyScore ${getScoreClass(
                  String(item.average) + "点"
                )}`}
              >
                {index + 1}位　{item.average}点
              </div>

              <p className="castName">{item.name}</p>

              <p className="historyDate">採点回数：{item.count}回</p>
            </div>
          ))}
        </section>

        <section className="historySection">
          <h2 className="historyTitle">人気ワード分析</h2>

          {wordRanking.length === 0 && (
            <p className="historyEmpty">まだ人気ワードがありません</p>
          )}

          {wordRanking.map((item, index) => (
            <div key={item.word} className="wordCard">
              <span className="wordRank">{index + 1}位</span>
              <span className="wordText">{item.word}</span>
              <span className="wordCount">{item.count}回</span>
            </div>
          ))}
        </section>

        <section className="historySection">
          <h2 className="historyTitle">NGワード傾向</h2>

          {ngWordRanking.length === 0 && (
            <p className="historyEmpty">NGワード傾向はまだありません</p>
          )}

          {ngWordRanking.map((item, index) => (
            <div key={item.word} className="wordCard ngWordCard">
              <span className="wordRank">{index + 1}位</span>
              <span className="wordText">{item.word}</span>
              <span className="wordCount">{item.count}回</span>
            </div>
          ))}
        </section>

        <section className="historySection">
          <h2 className="historyTitle">キャスト別 成長グラフ</h2>

          {castNames.length === 0 && (
            <p className="historyEmpty">まだ成長データがありません</p>
          )}

          {castNames.length > 0 && (
            <>
              <label className="label">表示するキャスト</label>

              <select
                className="input"
                value={activeCast}
                onChange={(e) => setSelectedCast(e.target.value)}
              >
                {castNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <div className="growthBox">
                {growthData.map((item, index) => (
                  <div key={item.id} className="growthItem">
                    <div className="growthLabel">{index + 1}</div>

                    <div className="growthBarWrap">
                      <div
                        className={`growthBar ${getPointClass(
                          String(item.score)
                        )}`}
                        style={{
                          width: `${item.score}%`,
                        }}
                      >
                        {item.score}点
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="historySection">
          <h2 className="historyTitle">過去の採点履歴</h2>

          <p
            style={{
              color: "red",
              fontSize: "18px",
            }}
          >
            履歴件数：{history.length}
          </p>

          {history.length === 0 && (
            <p className="historyEmpty">まだ履歴がありません</p>
          )}

          {history.map((item: any) => (
            <div key={item.id} className="historyCard">
              <div className={`historyScore ${getScoreClass(item.result)}`}>
                {getScore(item.result)}点
              </div>

              <div>
                <p className="castName">
                  キャスト名：{item.cast_name || "未入力"}
                </p>

                <p className="historyDiary">{item.diary}</p>

                <p className="historyDate">{item.created_at}</p>
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
