async function loadHistory() {
  try {
    const res = await fetch("/api/his");

    const data = await res.json();

    setHistory(data.history || []);
  } catch (error) {
    console.error(error);
  }
}
