// Canonical public URL of the site. Set NEXT_PUBLIC_SITE_URL once a custom
// domain is connected; until then the Vercel production alias is used.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://carcalc-sigma.vercel.app").replace(/\/$/, "");
