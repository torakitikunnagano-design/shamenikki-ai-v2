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

function countValidPosts(
  posts: any[],
  limitMinutes: number
) {
  const sorted = [...posts].sort((a: any, b: any) => {
    return (
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime()
    );
  });

  let count = 0;
  let lastCountedTime = 0;

  for (const post of sorted) {
    const postTime = new Date(
      post.created_at
    ).getTime();

    if (
      count === 0 ||
      postTime - lastCountedTime >=
        limitMinutes * 60 * 1000
    ) {
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

  const limitMinutes =
    settings?.repeat_limit_min || 60;

  const minTextLength =
    settings?.min_text_length || 100;

  const imageRequired =
    settings?.image_required === true;

  const today = new Date().toLocaleDateString(
    "sv-SE",
    {
      timeZone: "Asia/Tokyo",
    }
  );

  const todayPosts = scores.filter((item: any) => {
    return item.created_at?.startsWith(today);
  });

  const castNames = Array.from(
    new Set(
      todayPosts.map(
        (item: any) =>
          item.cast_name || "未設定"
      )
    )
  );

  const rows = castNames.map((castName: any) => {
    const posts = todayPosts.filter((item: any) => {
      return (
        (item.cast_name || "未設定") ===
        castName
      );
    });

    const rawCount = posts.length;

    const validCount = countValidPosts(
      posts,
      limitMinutes
    );

    const latestPost = posts[posts.length - 1];

    const textLength =
      latestPost?.diary?.length || 0;

    const hasEnoughText =
      textLength >= minTextLength;

    const hasImage =
      latestPost?.has_image === true;

    const imageCheck =
      imageRequired ? hasImage : true;

    const isGuaranteeOk =
      hasEnoughText &&
      imageCheck &&
      validCount >= goal;

    return {
      castName,
      rawCount,
      validCount,
      textLength,
      hasEnoughText,
      hasImage,
      isGuaranteeOk,
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
      <h1
        style={{
          fontSize: "40px",
          marginBottom: "30px",
        }}
      >
        保証条件管理
      </h1>

      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        {rows.map((row: any) => (
          <div
            key={row.castName}
            style={{
              background: "#1f1f1f",
              padding: "24px",
              borderRadius: "16px",
              border: row.isGuaranteeOk
                ? "1px solid #00ff99"
                : "1px solid #ff4444",
              display: "grid",
              gap: "10px",
            }}
          >
            <h2>{row.castName}</h2>

            <p>
              投稿数：
              {row.validCount}件
            </p>

            <p>
              文字数：
              {row.textLength}文字
            </p>

            <p>
              画像：
              {row.hasImage
                ? "あり"
                : "なし"}
            </p>

            <p
              style={{
                color: row.hasEnoughText
                  ? "#00ff99"
                  : "#ff4444",
              }}
            >
              {row.hasEnoughText
                ? "文字数達成"
                : "文字数不足"}
            </p>

            <p
              style={{
                color: row.hasImage
                  ? "#00ff99"
                  : "#ff4444",
              }}
            >
              {row.hasImage
                ? "画像達成"
                : "画像不足"}
            </p>

            <p
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                color: row.isGuaranteeOk
                  ? "#00ff99"
                  : "#ff4444",
              }}
            >
              {row.isGuaranteeOk
                ? "保証条件達成"
                : "保証条件未達"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
