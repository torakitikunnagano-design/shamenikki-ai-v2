"use client";

import { useEffect, useState } from "react";

export default function CastsPage() {
  const [casts, setCasts] = useState([]);

  async function loadCasts() {
    const res = await fetch("/api/casts", {
      cache: "no-store",
    });

    const data = await res.json();
    setCasts(data);
  }

  async function toggleActive(name: string, isActive: boolean) {
    await fetch("/api/casts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        is_active: !isActive,
      }),
    });

    loadCasts();
  }

  useEffect(() => {
    loadCasts();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "white",
        padding: "40px",
      }}
    >
      <h1 style={{ fontSize: "40px", marginBottom: "30px" }}>
        キャスト管理
      </h1>

      <div style={{ display: "grid", gap: "16px" }}>
        {casts.map((cast: any) => (
          <div
            key={cast.name}
            style={{
              background: "#1f1f1f",
              padding: "20px",
              borderRadius: "16px",
              border: cast.is_active
                ? "1px solid #00ff99"
                : "1px solid #666",
              display: "grid",
              gap: "12px",
            }}
          >
            <h2>{cast.name}</h2>

            <p
              style={{
                color: cast.is_active ? "#00ff99" : "#999",
              }}
            >
              {cast.is_active ? "在籍中" : "停止中"}
            </p>

            <button
              onClick={() => toggleActive(cast.name, cast.is_active)}
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: cast.is_active ? "#ff4444" : "#00ff99",
                color: cast.is_active ? "white" : "black",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {cast.is_active ? "在籍停止にする" : "在籍中に戻す"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
