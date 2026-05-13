async function getScores() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/scores`,
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
                fontWeight: "bold",
              }}
            >
              {item.result}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
