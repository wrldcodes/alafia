const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://alafia-ara.vercel.app"
    : "http://localhost:3000");

export const siteUrl = rawSiteUrl.startsWith("http")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;
export const metadataBase = new URL(siteUrl);
