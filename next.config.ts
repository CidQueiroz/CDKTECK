import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'export',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@cidqueiroz/cdkteck-ui': path.resolve(__dirname, '../cdkteck-ui/src'),
      };
    }
    return config;
  },
  // Para Turbopack
  transpilePackages: ['@cidqueiroz/cdkteck-ui'],
};

export default nextConfig;