export default function CastsPage() {
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
        キャスト管理
      </h1>

      <div
        style={{
          background: "#1f1f1f",
          padding: "24px",
          borderRadius: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>なな</h2>
        <p>写メ日記スコア：92点</p>
      </div>

      <div
        style={{
          background: "#1f1f1f",
          padding: "24px",
          borderRadius: "20px",
        }}
      >
        <h2>りお</h2>
        <p>写メ日記スコア：88点</p>
      </div>
    </main>
  );
}
