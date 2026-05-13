async function getScores() {
  const res = await fetch(
    "https://shamenikki-ai-v2-aya8.vercel.app/api/scores",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function ScoresPage() {
  const scores = await getScores();

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
          fontWeight: "bold",
          marginBottom: "30px",
        }}
      >
        AI採点履歴
      </h1>

      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {scores.map((item: any, index: number) => (
          <div
            key={index}
            style={{
              background: "#1f1f1f",
              padding: "24px",
              borderRadius: "20px",
            }}
          >
            <p
              style={{
                marginBottom: "12px",
                color: "#aaa",
              }}
            >
              写メ日記
            </p>

            <p
              style={{
                marginBottom: "20px",
              }}
            >
              {item.diary}
            </p>

            <p
              style={{
                color: "#00ff99",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              {item.result.match(/(\d+)点/)?.[0] || "点数なし"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
