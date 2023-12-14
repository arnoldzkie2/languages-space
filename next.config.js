/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();


const nextConfig = {
  images: {
    domains: ["uploadthing.com", "utfs.io"], // Add more domains if needed
  },
  experimental: {
    serverComponentsExternalPackages: [
      '@react-email/components',
      '@react-email/render',
      '@react-email/tailwind'
  ]
  }
};

module.exports = withNextIntl(nextConfig);
