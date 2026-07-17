/** @type {import('next').NextConfig} */
// Keep this value as an origin only. The rewrite below owns the `/api/v1`
// prefix. Also tolerate an env value entered with `/api/v1`.
const API_ORIGIN = (
  process.env.API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://rurallysmile-org-1.onrender.com"
)
  .replace(/\/$/, "")
  .replace(/\/api\/v1$/, "");

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_ORIGIN}/api/v1/:path*`,
      },
    ];
  },
  webpack: (config: { resolve: { alias?: Record<string, string> } }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
