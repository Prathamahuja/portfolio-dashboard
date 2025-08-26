/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'standalone',
  // Add this to silence the warning about multiple lockfiles
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;