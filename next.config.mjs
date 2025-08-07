/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  basePath: isProd ? "/E-learning" : "",
  assetPrefix: isProd ? "/E-learning/" : "",
  //output: "export",
  images: {
    unoptimized: true,
  },
  // --- ADDED THIS LINE ---
  staticPageGenerationTimeout: 120,
};

export default nextConfig;