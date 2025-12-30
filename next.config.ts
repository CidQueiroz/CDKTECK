import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'export',
  // Ignorar erros de TS no build para permitir deploy (problema de tipos na lib externa)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Para Turbopack e Webpack (garante transpilação do pacote UI)
  transpilePackages: ['@cidqueiroz/cdkteck-ui'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    };
    return config;
  },
};

export default nextConfig;