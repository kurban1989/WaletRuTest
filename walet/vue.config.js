const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(process.env.NODE_ENV === "production"),
        DEVELOPMENT: JSON.stringify(process.env.NODE_ENV === "development"),
      }),
    ],
  },
});
