import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    authInterrupts: true,
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "5wteeckrb7tzxhwc.public.blob.vercel-storage.com",
      },
      { protocol: "https", hostname: "loremflickr.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "cdn.imagin.studio" },
      { protocol: "https", hostname: "www.netcarshow.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
