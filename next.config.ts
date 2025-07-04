const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable in dev mode
});

module.exports = withPWA({
  reactStrictMode: true,
});
module.exports = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

