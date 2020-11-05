const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const OptimizeCssAssets = require("optimize-css-assets-webpack-plugin");

const getFilename = (isDevMode, ext) => {
  return isDevMode ? `[name].${ext}` : `[name].[fullhash].${ext}`;
};

const optimization = (isProdMode) => {
  const config = {
    minimize: isProdMode,
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProdMode) {
    config.minimizer = [new TerserPlugin(), new OptimizeCssAssets()];
  }
  return config;
};

const getCssLoaders = (isDevMode, addition) => {
  const loaders = [
    {
      loader: MiniCSSExtractPlugin.loader,
      options: {
        hmr: isDevMode,
        reloadAll: true,
      },
    },
    "css-loader",
  ];

  if (addition) loaders.push(addition);

  return loaders;
};

module.exports = (env, argv) => {
  const isDevMode = argv.mode === "development";
  const isProdMode = !isDevMode;

  return {
    context: path.resolve(__dirname, "src"),
    entry: {
      main: path.resolve(__dirname, "src", "index.ts"),
    },
    output: {
      filename: getFilename(isDevMode, "js"),
      path: path.resolve(__dirname, "dist"),
    },
    resolve: {
      // alias: {
      //   '@': path.resolve(__dirname, 'src')
      // }
      extensions: ["ts", "tsx", "js", "jsx"],
    },
    devtool: isDevMode ? "inline-source-map" : undefined,
    optimization: optimization(isProdMode),
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "assets",
            to: "assets",
          },
        ],
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["!assets"],
      }),
      new HtmlPlugin({
        template: path.resolve(__dirname, "src", "public", "./index.html"),
        minify: {
          collapseWhitespace: isProdMode,
        },
      }),
      new MiniCSSExtractPlugin({
        filename: getFilename(isDevMode, "css"),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.s[ca]ss$/i,
          exclude: /node_modules/,
          use: getCssLoaders(isDevMode, "sass-loader"),
        },
        {
          test: /\.css$/i,
          exclude: /node_modules/,
          use: getCssLoaders(isDevMode),
        },
        {
          test: /\.tsx?/i,
          exclude: /node_modules/,
          use: "ts-loader",
        },
        {
          test: /\.(ttf|woff2?|eot)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "fonts",
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpe?g|gif)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "img",
              },
            },
          ],
        },
      ],
    },
  };
};
