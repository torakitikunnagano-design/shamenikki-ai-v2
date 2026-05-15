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

async function getCasts() {
  const res = await fetch(
    "https://shamenikki-ai-v2-aya8.vercel.app/api/casts",
    { cache: "no-store" }
  );

  return res.json();
}

function countValidPosts(posts: any[], limitMinutes: number) {
  const sorted = [...posts].sort((a: any, b: any) => {
    return new Date(a.posted_at || a.created_at).getTime() -
      new Date(b.posted_at || b.created_at).getTime();
  });

  let count = 0;
  let lastCountedTime = 0;

  for (const post of sorted) {
    const postTime = new Date(post.posted_at || post.created_at).getTime();

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

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getJapanMinutes(dateString: string) {
  const date = new Date(dateString);

  return Number(
    new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .format(date)
      .replace(":", "")
      .slice(0, 2)
  ) * 60 + Number(
    new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      minute: "2-digit",
    }).format(date)
  );
}

function checkBeforeWork(post: any, workStart: string, beforeWorkMin: number) {
  if (!post || !workStart) return false;

  const postMinutes = getJapanMinutes(post.posted_at || post.created_at);
  const startMinutes = timeToMinutes(workStart);

  return postMinutes <= startMinutes - beforeWorkMin;
}

export default async function CastCheckPage() {
  const scores = await getScores();
  const settings = await getSettings();
  const casts = await getCasts();

  const goal = settings?.daily_post_goal || 5;
  const limitMinutes = settings?.repeat_limit_min || 60;
  const minTextLength = settings?.min_text_length || 100;
  const imageRequired = settings?.image_required === true;
  const beforeWorkMin = settings?.before_work_min || 60;

  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Tokyo",
  });

  const todayPosts = scores.filter((item: any) => {
    const date = new Date(item.posted_at || item.created_at);

    const japanDate = date.toLocaleDateString("sv-SE", {
      timeZone: "Asia/Tokyo",
    });

    return japanDate === today;
  });

  const activeCasts = casts.filter((cast: any) => {
    return cast.is_active === true;
  });

  const rows = activeCasts.map((cast: any) => {
    const posts = todayPosts.filter((item: any) => {
      return (item.cast_name || "未設定") === cast.name;
    });

    const sortedPosts = [...posts].sort((a: any, b: any) => {
      return (
        new Date(a.posted_at || a.created_at).getTime() -
        new Date(b.posted_at || b.created_at).getTime()
      );
    });

    const firstPost = sortedPosts[0];
    const latestPost = sortedPosts[sortedPosts.length - 1];

    const rawCount = posts.length;
    const validCount = countValidPosts(posts, limitMinutes);

    const textLength = latestPost?.diary?.length || 0;
    const hasEnoughText = textLength >= minTextLength;

    const hasImage = latestPost?.has_image === true;
    const imageCheck = imageRequired ? hasImage : true;

    const beforeWorkOk = checkBeforeWork(
      firstPost,
      cast.work_start,
      beforeWorkMin
    );

    const isGuaranteeOk =
      validCount >= goal &&
      hasEnoughText &&
      imageCheck &&
      beforeWorkOk;

    return {
      castName: cast.name,
      rawCount,
      validCount,
      textLength,
      hasEnoughText,
      hasImage,
      workStart: cast.work_start || "未設定",
      beforeWorkOk,
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
      <h1 style={{ fontSize: "40px", marginBottom: "30px" }}>
        保証条件管理
      </h1>

      <p style={{ color: "#aaa", marginBottom: "20px" }}>
        目標：{goal}件 / 連投除外：{limitMinutes}分 / 最低文字数：
        {minTextLength}文字 / 出勤前：{beforeWorkMin}分前まで
      </p>

      <div style={{ display: "grid", gap: "16px" }}>
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

            <p>投稿数：{row.validCount}件</p>
            <p>文字数：{row.textLength}文字</p>
            <p>画像：{row.hasImage ? "あり" : "なし"}</p>
            <p>出勤時間：{row.workStart}</p>

            <p style={{ color: row.hasEnoughText ? "#00ff99" : "#ff4444" }}>
              {row.hasEnoughText ? "文字数達成" : "文字数不足"}
            </p>

            <p style={{ color: row.hasImage ? "#00ff99" : "#ff4444" }}>
              {row.hasImage ? "画像達成" : "画像不足"}
            </p>

            <p style={{ color: row.beforeWorkOk ? "#00ff99" : "#ff4444" }}>
              {row.beforeWorkOk ? "出勤前投稿達成" : "出勤前投稿未達"}
            </p>

            <p
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                color: row.isGuaranteeOk ? "#00ff99" : "#ff4444",
              }}
            >
              {row.isGuaranteeOk ? "保証条件達成" : "保証条件未達"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
