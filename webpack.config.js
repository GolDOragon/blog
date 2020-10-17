const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDevMode = process.env.NODE_ENV === 'development';
const isProdMode = !isDevMode;

const getFilename = (ext) =>
  isDevMode ? `[name].${ext}` : `[name].[hash].${ext}`;

const getJSLoader = (loader) => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['transform-class-properties'],
      },
    },
  ];

  if (loader) loaders.push(loader);
  if (isDevMode) loaders.push('eslint-loader');
  return loaders;
};

const getCSSLoader = (addition) => {
  const loaders = [
    {
      loader: MiniCSSExtractPlugin.loader,
      options: {
        hmr: isDevMode,
        reloadAll: true,
      },
    },
    'css-loader',
  ];

  if (addition) loaders.push(addition);
  return loaders;
};

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProdMode) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }
  return config;
};

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: ['@babel/polyfill', './index.js'],
  },
  output: {
    filename: getFilename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: isDevMode ? 'inline-source-map' : '',
  devServer: {
    port: '8080',
    open: isDevMode,
  },
  optimization: optimization(),
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'assets', to: 'dest' }],
    }),
    new HtmlPlugin({
      template: path.resolve(__dirname, 'src', 'public', 'index.html'),
      minify: {
        collapseWhitespace: isProdMode,
        removeComments: isProdMode,
        removeRedundantAttributes: isProdMode,
        removeScriptTypeAttributes: isProdMode,
        removeStyleLinkTypeAttributes: isProdMode,
        useShortDoctype: isProdMode,
      },
    }),
    new MiniCSSExtractPlugin({
      filename: getFilename('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: getJSLoader(),
      },
      {
        test: /\.ts$/i,
        exclude: /node_modules/,
        use: getJSLoader('ts-loader'),
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: getCSSLoader(),
      },
      {
        test: /\.s[ca]ss$/i,
        exclude: /node_modules/,
        use: getCSSLoader('sass-loader'),
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'fonts',
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'img',
            },
          },
        ],
      },
    ],
  },
};
