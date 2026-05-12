async function handleScore() {
  setLoading(true);
  setResult("");
  setSelected(null);

  try {
    const res = await fetch("/api/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        diary,
        type,
      }),
    });

    const data = await res.json();

    console.log("API結果", data);

    setResult(data.result);

    await loadHistories();

  } catch (error) {
    console.error(error);

    setResult("エラーが発生しました");
  }

  setLoading(false);
}
