async function getScores() {
  const res = await fetch(
    "https://shamenikki-ai-v2-aya8.vercel.app/api/scores",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

function getPoint(result: string) {
  const match = result.match(/(\d+)点/);
  return match ? Number(match[1]) : 0;
}

export default async function ScoresPage() {
  const scores = await getScores();

  const sortedScores = scores.sort((a: any, b: any) => {
    return getPoint(b.result) - getPoint(a.result);
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
          fontWeight: "bold",
          marginBottom: "30px",
        }}
      >
        AI採点ランキング
      </h1>

      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {sortedScores.map((item: any, index: number) => {
          const point = getPoint(item.result);

          return (
            <div
              key={index}
              style={{
                background: "#1f1f1f",
                padding: "24px",
                borderRadius: "20px",
                border:
                  index === 0
                    ? "1px solid #00ff99"
                    : "1px solid #333",
              }}
            >
              <p
                style={{
                  color: "#aaa",
                  marginBottom: "10px",
                }}
              >
                第{index + 1}位
              </p>

              <p
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  marginBottom: "12px",
                }}
              >
                {item.cast_name || "名前なし"}
              </p>

              <p
                style={{
                  color: "#00ff99",
                  fontSize: "32px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                {point}点
              </p>

              <p
                style={{
                  color: "#aaa",
                  marginBottom: "12px",
                }}
              >
                写メ日記
              </p>

              <p>{item.diary}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
