/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Mantendo a transpilação do UI Kit caso ele use JSX/TS não compilado
  transpilePackages: ['@cidqueiroz/cdkteck-ui'],
};

export default nextConfig;
