import type { NextConfig } from "next";

interface ExtendedNextConfig extends NextConfig {
  eslint?: {
    ignoreDuringBuilds?: boolean;
  };
}

const nextConfig: ExtendedNextConfig = {
  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

  // 禁用 Next.js 热重载，由 nodemon 处理重编译 —— (nếu không dùng nodemon nữa thì bỏ comment này cũng được)
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "images.amazon.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.amazon.com",
        port: "",
        pathname: "/images/**",
      },
    ],
    domains: ["images.amazon.com", "via.placeholder.com"],
    unoptimized: false,
  },

  eslint: {
    // Bỏ qua lỗi ESLint khi build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
