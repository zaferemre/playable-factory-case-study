import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.treatsfromoz.com",
        pathname: "/**",
      },
    ],
  },
  // Updated server external packages configuration
  serverExternalPackages: [],
  // Handle potential build issues
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable telemetry
  telemetry: {
    enabled: false,
  },
};

export default nextConfig;
