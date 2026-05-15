async function getScores() {
  const res = await fetch(
    "https://shamenikki-ai-v2-aya8.vercel.app/api/scores",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

async function getCasts() {
  const res = await fetch(
    "https://shamenikki-ai-v2-aya8.vercel.app/api/casts",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function NoPostPage() {
  const scores = await getScores();
  const casts = await getCasts();

  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Tokyo",
  });

  const todayPosts = scores.filter((item: any) => {
    return item.created_at?.startsWith(today);
  });

  const postedCastNames = Array.from(
    new Set(
      todayPosts.map((item: any) => item.cast_name || "未設定")
    )
  );

  const activeCasts = casts.filter((cast: any) => {
    return cast.is_active === true;
  });

  const noPostCasts = activeCasts.filter((cast: any) => {
    return !postedCastNames.includes(cast.name);
  });

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
        今日未投稿キャスト
      </h1>

      <p style={{ color: "#aaa", marginBottom: "20px" }}>
        在籍キャストから自動判定
      </p>

      <div style={{ display: "grid", gap: "16px" }}>
        {noPostCasts.map((cast: any) => (
          <div
            key={cast.name}
            style={{
              background: "#1f1f1f",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #ff4444",
            }}
          >
            <h2>{cast.name}</h2>

            <p style={{ color: "#ff9999" }}>
              本日まだ投稿なし
            </p>
          </div>
        ))}

        {noPostCasts.length === 0 && (
          <div
            style={{
              background: "#1f1f1f",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #00ff99",
            }}
          >
            全キャスト投稿済み 🎉
          </div>
        )}
      </div>
    </main>
  );
}
