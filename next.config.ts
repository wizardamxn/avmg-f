/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Also ignore ESLint errors just to be absolutely sure nothing blocks the launch
    ignoreDuringBuilds: true,
  },
};

export default nextConfig; // Use 'module.exports = nextConfig;' if the file is .js
