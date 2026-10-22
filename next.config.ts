import type { NextConfig } from "next";

// Old and alternate hostnames that should permanently redirect to the
// canonical domain, so search engines see one site instead of duplicates.
const LEGACY_HOSTS = ["carcalc-sigma.vercel.app", "www.carcalcisrael.com"];

const nextConfig: NextConfig = {
  async redirects() {
    return LEGACY_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://carcalcisrael.com/:path*",
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
