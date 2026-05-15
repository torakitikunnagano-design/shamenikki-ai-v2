async function getScores() {
  const res = await fetch(
    "https://shamenikki-ai-v2-aya8.vercel.app/api/scores",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function NoPostPage() {
  const scores = await getScores();

  const today = new Date().toLocaleDateString(
    "sv-SE",
    {
      timeZone: "Asia/Tokyo",
    }
  );

  const todayPosts = scores.filter((item: any) => {
    return item.created_at?.startsWith(today);
  });

  const postedCastNames = Array.from(
    new Set(
      todayPosts.map(
        (item: any) =>
          item.cast_name || "未設定"
      )
    )
  );

  const allCasts = [
    "さくら",
    "ゆあ",
    "りお",
    "みく",
    "なな",
  ];

  const noPostCasts = allCasts.filter(
    (cast) => !postedCastNames.includes(cast)
  );

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
        今日未投稿キャスト
      </h1>

      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        {noPostCasts.map((cast) => (
          <div
            key={cast}
            style={{
              background: "#1f1f1f",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #ff4444",
            }}
          >
            <h2>{cast}</h2>

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
