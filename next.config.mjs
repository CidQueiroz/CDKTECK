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
  // Mantendo a configuração do WEBPACK que você exige
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
