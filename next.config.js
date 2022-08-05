const appConfig = require("./app.config");
const withImages = require("next-images");
const path = require("path");
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

const imagesConfig = withImages({
  esModule: true,
  webpack: (config) => config,
});

module.exports = (phase) => {
  return {
    env: { ...appConfig },
    compress: false,
    ...imagesConfig,
  };
};
