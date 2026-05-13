export default function AdminPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "white",
        padding: "24px",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "24px",
        }}
      >
        管理画面
      </h1>

      <div
        style={{
          background: "#1a1a1a",
          padding: "20px",
          borderRadius: "16px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
          写メ日記AI
        </h2>

        <p style={{ color: "#aaa" }}>
          管理者専用ページ
        </p>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          padding: "20px",
          borderRadius: "16px",
        }}
      >
        <p>・ランキング管理</p>
        <p>・店舗管理</p>
        <p>・キャスト管理</p>
      </div>
    </main>
  );
}
