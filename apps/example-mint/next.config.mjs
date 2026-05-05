/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@castkit/ui', '@castkit/core', '@castkit/adapter-mock', '@castkit/adapter-wagmi'],
};

export default nextConfig;

