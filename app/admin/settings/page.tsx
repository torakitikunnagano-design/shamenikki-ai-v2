export default function SettingsPage() {
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
        店舗ルール設定
      </h1>

      <div
        style={{
          background: "#1f1f1f",
          padding: "24px",
          borderRadius: "20px",
          display: "grid",
          gap: "16px",
        }}
      >
        <p>店舗名：NADESHIKO</p>
        <p>1日の投稿目標：5件</p>
        <p>連投除外時間：60分以内</p>
        <p>画像必須：ON</p>
        <p>出勤前投稿：60分前</p>
        <p>退勤前投稿：60分前</p>
      </div>
    </main>
  );
}
