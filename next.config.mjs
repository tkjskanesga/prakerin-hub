/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  // poweredByHeader: "E-PKL Report & Tracker",
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
