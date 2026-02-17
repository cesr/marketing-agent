export default async function run(input) {
  const url = typeof input?.url === "string" ? input.url.trim() : "";
  if (!url) {
    return { error: "A \"url\" string is required." };
  }

  const MAX_LENGTH = 32_000;

  const response = await fetch(url, {
    headers: { "User-Agent": "poncho-fetch-page/1.0" },
    redirect: "follow",
  });

  if (!response.ok) {
    return { url, status: response.status, error: response.statusText };
  }

  const html = await response.text();

  // Lightweight HTML-to-text: strip tags, collapse whitespace.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  const content = text.length > MAX_LENGTH
    ? text.slice(0, MAX_LENGTH) + "… (truncated)"
    : text;

  return { url, status: response.status, content };
}
