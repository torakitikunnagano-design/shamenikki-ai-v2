import Link from "next/link";

export default function AdminPage() {
  const cards = [
    {
      title: "ランキング",
      desc: "AI採点ランキング",
      href: "/admin/scores",
    },
    {
      title: "キャスト管理",
      desc: "女の子情報管理",
      href: "/admin/casts",
    },
    {
      title: "AI分析",
      desc: "写メ日記分析",
      href: "/",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #0f0f0f, #1a1a1a)",
        color: "white",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "40px",
          fontWeight: "bold",
          marginBottom: "40px",
        }}
      >
        管理画面
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >
            <div
              style={{
                background: "#1f1f1f",
                padding: "24px",
                borderRadius: "20px",
                border: "1px solid #333",
                boxShadow:
                  "0 0 20px rgba(0,0,0,0.4)",
                cursor: "pointer",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "12px",
                }}
              >
                {card.title}
              </h2>

              <p
                style={{
                  color: "#aaa",
                }}
              >
                {card.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
