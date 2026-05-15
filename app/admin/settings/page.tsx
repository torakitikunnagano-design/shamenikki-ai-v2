"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [goal, setGoal] = useState(5);
  const [limitMinutes, setLimitMinutes] = useState(60);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setGoal(data.daily_post_goal || 5);
        setLimitMinutes(data.repeat_limit_minutes || 60);
      });
  }, []);

  async function saveSettings() {
    await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        daily_post_goal: goal,
        repeat_limit_minutes: limitMinutes,
      }),
    });

    alert("保存しました");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "white",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "40px",
          marginBottom: "30px",
        }}
      >
        店舗ルール設定
      </h1>

      <div
        style={{
          background: "#1f1f1f",
          padding: "24px",
          borderRadius: "20px",
          maxWidth: "500px",
          display: "grid",
          gap: "20px",
        }}
      >
        <div>
          <p style={{ marginBottom: "8px" }}>
            1日の目標投稿数
          </p>

          <input
            type="number"
            value={goal}
            onChange={(e) =>
              setGoal(Number(e.target.value))
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#333",
              color: "white",
            }}
          />
        </div>

        <div>
          <p style={{ marginBottom: "8px" }}>
            連投除外時間（分）
          </p>

          <input
            type="number"
            value={limitMinutes}
            onChange={(e) =>
              setLimitMinutes(
                Number(e.target.value)
              )
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#333",
              color: "white",
            }}
          />
        </div>

        <button
          onClick={saveSettings}
          style={{
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "#00ff99",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          保存
        </button>
      </div>
    </main>
  );
}
