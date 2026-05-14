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

export default async function CheckPage() {
  const scores = await getScores();
  const settings = await getSettings();

  const today = new Date().toISOString().slice(0, 10);

  const todayPosts = scores.filter((item: any) => {
    return item.created_at?.startsWith(today);
  });

  const count = todayPosts.length;

  const goal = settings?.daily_post_goal || 5;

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
        投稿チェック
      </h1>

      <div
        style={{
          background: "#1f1f1f",
          padding: "24px",
          borderRadius: "20px",
          border:
            count >= goal
              ? "1px solid #00ff99"
              : "1px solid #ffcc00",
        }}
      >
        <p
          style={{
            fontSize: "22px",
            marginBottom: "16px",
          }}
        >
          本日の投稿数
        </p>

        <p
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color:
              count >= goal
                ? "#00ff99"
                : "#ffcc00",
          }}
        >
          {count}件
        </p>

        <p
          style={{
            marginTop: "16px",
            color: "#aaa",
          }}
        >
          目標：{goal}件
        </p>

        <p
          style={{
            marginTop: "8px",
            color: "#aaa",
          }}
        >
          {count >= goal
            ? "投稿条件達成"
            : `目標まであと ${goal - count} 件`}
        </p>
      </div>
    </main>
  );
}
