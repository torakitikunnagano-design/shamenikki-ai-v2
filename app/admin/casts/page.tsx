async function getCasts() {
  const res = await fetch(
    "https://shamenikki-ai-v2-aya8.vercel.app/api/casts",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function CastsPage() {
  const casts = await getCasts();

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
        キャスト管理
      </h1>

      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
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
            }}
          >
            <h2>{cast.name}</h2>

            <p
              style={{
                color: cast.is_active
                  ? "#00ff99"
                  : "#999",
              }}
            >
              {cast.is_active
                ? "在籍中"
                : "停止中"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
