/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    //domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
    ],
    /*  remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        pathname: "**",
      },
    ], */
    /* remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "7299",
        pathname: "localhost:7299/files",
      },
    ], */
  },
};

export default nextConfig;
