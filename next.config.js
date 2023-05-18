/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export to a static-site instead of server rendering.
  output: "export",

  // Define directory where static files will be outputted to.
  distDir: "dist",

  reactStrictMode: true,
}

module.exports = nextConfig
