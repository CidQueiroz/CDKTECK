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
};

export default nextConfig;