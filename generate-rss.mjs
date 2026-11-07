import { readFile, writeFile } from "node:fs/promises";

const siteUrl = "https://jckspjf.nekoweb.org";
const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const escapeXml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
}[character]));
  const formatRssDate = date => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZoneName: "longOffset"
    }).formatToParts(date);
    const part = type => parts.find(value => value.type === type)?.value;
    const offset = part("timeZoneName").replace("GMT", "").replace(":", "");

    return `${part("weekday")}, ${part("day")} ${part("month")} ${part("year")} ${part("hour")}:${part("minute")}:${part("second")} ${offset}`;
  };
const index = await readJson("./posts.json");
const posts = await Promise.all(index.posts.map(async id => ({
    id,
    ...await readJson(`./posts/${id}.json`)
})));

posts.sort((left, right) => Date.parse(right.date) - Date.parse(left.date));

const items = posts.map(post => {
    const url = `${siteUrl}/posts/${encodeURIComponent(post.id)}.html`;
    const published = new Date(post.date);
    if (Number.isNaN(published.getTime())) {
        throw new Error(`Invalid post date for ${post.id}: ${post.date}`);
    }

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${published.toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
}).join("");

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>jckspjf's blog</title>
    <link>${siteUrl}/blog.html</link>
    <description>Posts from an infinitesimal point in time, somewhere.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>
`;

await writeFile(new URL("./rss.xml", import.meta.url), feed);