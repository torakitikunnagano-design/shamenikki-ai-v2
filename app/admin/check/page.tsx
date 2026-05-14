async function getScores() {
  const res = await fetch(
    "https://shamenikki-ai-v2-aya8.vercel.app/api/scores",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

async function getSettings() {
  const res = await fetch(
    "https://shamenikki-ai-v2-aya8.vercel.app/api/settings",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

function countValidPosts(posts: any[], limitMinutes: number) {
  const sorted = posts.sort((a: any, b: any) => {
    return (
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime()
    );
  });

  let count = 0;
  let lastCountedTime = 0;

  for (const post of sorted) {
    const postTime = new Date(post.created_at).getTime();

    if (
      count === 0 ||
      postTime - lastCountedTime >= limitMinutes * 60 * 1000
    ) {
      count++;
      lastCountedTime = postTime;
    }
  }

  return count;
}

export default async function CheckPage() {
  const scores = await getScores();
  const settings = await getSettings();

  const today = new Date().toISOString().slice(0, 10);

  const todayPosts = scores.filter((item: any) => {
    return item.created_at?.startsWith(today);
  });

  const goal = settings?.daily_post_goal || 5;
  const limitMinutes = settings?.repeat_limit_minutes || 60;

  const rawCount = todayPosts.length;
  const validCount = countValidPosts(todayPosts, limitMinutes);

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
        投稿チェック
      </h1>

      <div
        style={{
          background: "#1f1f1f",
          padding: "24px",
          borderRadius: "20px",
          border:
            validCount >= goal
              ? "1px solid #00ff99"
              : "1px solid #ffcc00",
        }}
      >
        <p style={{ fontSize: "22px", marginBottom: "16px" }}>
          本日の有効投稿数
        </p>

        <p
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color:
              validCount >= goal
                ? "#00ff99"
                : "#ffcc00",
          }}
        >
          {validCount}件
        </p>

        <p style={{ marginTop: "16px", color: "#aaa" }}>
          実投稿数：{rawCount}件
        </p>

        <p style={{ marginTop: "8px", color: "#aaa" }}>
          連投除外：{limitMinutes}分以内は1件扱い
        </p>

        <p style={{ marginTop: "8px", color: "#aaa" }}>
          目標：{goal}件
        </p>

        <p style={{ marginTop: "8px", color: "#aaa" }}>
          {validCount >= goal
            ? "投稿条件達成"
            : `目標まであと ${goal - validCount} 件`}
        </p>
      </div>
    </main>
  );
}
