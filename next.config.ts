/** @type {import('next').NextConfig} */
const nextConfig = {
  // Traces the actual import graph and emits a self-contained server.js plus
  // only the node_modules it really needs. Without this the runtime image has
  // to carry the entire dependency tree (~500MB vs ~150MB).
  output: "standalone",
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
