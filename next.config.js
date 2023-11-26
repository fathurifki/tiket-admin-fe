/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1csarkz8obe9u.cloudfront.net",
        port: "",
        pathname: "/posterpreviews/**",
      },
      {
        protocol: "https",
        hostname: "cdn.builder.io",
        port: "",
        pathname: "/api/v1/**",
      },
      {
        protocol: "https",
        hostname: "barcode.tec-it.com",
        port: "",
        pathname: "/barcode.ashx/**",
      },
      {
        protocol: "https",
        hostname: "s3-ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/loket-production-sg/**",
      },
      {
        protocol: "https",
        hostname: "api.yesplis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3-alpha-sig.figma.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tiket-minio-api.captain.nerd.8bitmixtape.cc",
        port: "",
        pathname: "/tiket-files/**",
      },
    ],
  },
};

module.exports = nextConfig;
