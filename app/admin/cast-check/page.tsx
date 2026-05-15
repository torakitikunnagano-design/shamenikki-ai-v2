async function getScores() {
  const res = await fetch(
    "https://shamenikki-ai-v2-aya8.vercel.app/api/scores",
    { cache: "no-store" }
  );

  return res.json();
}

async function getSettings() {
  const res = await fetch(
    "https://shamenikki-ai-v2-aya8.vercel.app/api/settings",
    { cache: "no-store" }
  );

  return res.json();
}

function countValidPosts(posts: any[], limitMinutes: number) {
  const sorted = [...posts].sort((a: any, b: any) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  let count = 0;
  let lastCountedTime = 0;

  for (const post of sorted) {
    const postTime = new Date(post.created_at).getTime();

    if (count === 0 || postTime - lastCountedTime >= limitMinutes * 60 * 1000) {
      count++;
      lastCountedTime = postTime;
    }
  }

  return count;
}

export default async function CastCheckPage() {
  const scores = await getScores();
  const settings = await getSettings();

  const goal = settings?.daily_post_goal || 5;
  const limitMinutes = settings?.repeat_limit_minutes || 60;

  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Tokyo",
  });

  const todayPosts = scores.filter((item: any) => {
    return item.created_at?.startsWith(today);
  });

  const castNames = Array.from(
    new Set(
      todayPosts.map((item: any) => item.cast_name || "未設定")
    )
  );

  const rows = castNames.map((castName: any) => {
    const posts = todayPosts.filter((item: any) => {
      return (item.cast_name || "未設定") === castName;
    });

    const rawCount = posts.length;
    const validCount = countValidPosts(posts, limitMinutes);

    return {
      castName,
      rawCount,
      validCount,
      achieved: validCount >= goal,
    };
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
        キャスト別 投稿達成管理
      </h1>

      <p style={{ color: "#aaa", marginBottom: "20px" }}>
        目標：{goal}件 / 連投除外：{limitMinutes}分以内は1件扱い
      </p>

      <div style={{ display: "grid", gap: "16px" }}>
        {rows.map((row: any) => (
          <div
            key={row.castName}
            style={{
              background: "#1f1f1f",
              padding: "20px",
              borderRadius: "16px",
              border: row.achieved
                ? "1px solid #00ff99"
                : "1px solid #ffcc00",
              display: "grid",
              gap: "8px",
            }}
          >
            <h2 style={{ fontSize: "24px" }}>{row.castName}</h2>

            <p>有効投稿：{row.validCount}件</p>
            <p style={{ color: "#aaa" }}>実投稿：{row.rawCount}件</p>

            <p
              style={{
                fontWeight: "bold",
                color: row.achieved ? "#00ff99" : "#ffcc00",
              }}
            >
              {row.achieved
                ? "投稿条件達成"
                : `未達成：あと ${goal - row.validCount} 件`}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
