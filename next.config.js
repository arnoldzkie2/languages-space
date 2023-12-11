/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();


const nextConfig = {
  images: {
    domains: ["uploadthing.com", "utfs.io"], // Add more domains if needed
  },
};

module.exports = withNextIntl(nextConfig);
