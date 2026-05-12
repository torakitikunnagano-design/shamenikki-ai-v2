function getParts(result: string) {
  return {
    score: result.match(/(\d+)点/)?.[1] || "--",

    good:
      result.match(
        /【良いところ】([\s\S]*?)【改善/
      )?.[1] || "",

    improve:
      result.match(
        /【改善点】([\s\S]*?)【タイトル案】/
      )?.[1] ||

      result.match(
        /【改善ポイント】([\s\S]*?)【タイトル案】/
      )?.[1] ||

      "",

    title:
      result.match(
        /【タイトル案】([\s\S]*?)【人気キャスト風改善例】/
      )?.[1] || "",

    rewrite:
      result.match(
        /【人気キャスト風改善例】([\s\S]*)/
      )?.[1] || "",
  };
}
