import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'export',
  // Para Turbopack e Webpack (garante transpilação do pacote UI)
  transpilePackages: ['@cidqueiroz/cdkteck-ui'],
};

export default nextConfig;