import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Mantendo a transpilação do UI Kit
  transpilePackages: ['@cidqueiroz/cdkteck-ui'],
  // Configuração EXCLUSIVA para Webpack para garantir Singleton do React
  webpack: (config) => {
    config.resolve.alias['react'] = path.resolve(__dirname, 'node_modules', 'react');
    config.resolve.alias['react-dom'] = path.resolve(__dirname, 'node_modules', 'react-dom');
    return config;
  },
};

export default nextConfig;
