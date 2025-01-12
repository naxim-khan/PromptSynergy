const path = require('path');

module.exports = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    // Add this alias configuration
    config.resolve.alias['@'] = path.resolve(__dirname, './');

    return config;
  },
};
