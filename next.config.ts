// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  // keep disabled in development so PWA service worker doesn't conflict
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  reactStrictMode: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
});

