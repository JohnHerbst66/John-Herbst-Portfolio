/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // The public gallery moved to /files. Kept so older links don't 404.
      { source: "/portfolio", destination: "/files", permanent: true },
    ];
  },
};

export default nextConfig;
