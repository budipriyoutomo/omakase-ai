/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  /** Dev/production proxy: avoids browser CORS when NEXT_PUBLIC_API_BASE_URL=/api-backend */
  async rewrites() {
    const target = process.env.API_PROXY_TARGET?.replace(/\/$/, "");
    if (!target) return [];
    return [{ source: "/api-backend/:path*", destination: `${target}/:path*` }];
  },
};

export default nextConfig;
