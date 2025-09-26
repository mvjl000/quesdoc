/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.resolve.alias.canvas = false;
        config.resolve.alias.encoding = false;

        // Add explicit path mapping for @/* aliases
        config.resolve.alias["@"] = path.resolve(__dirname, "src");

        return config;
    },
};

module.exports = nextConfig;
