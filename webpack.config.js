const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDevMode = process.env.NODE_ENV === 'development';
const isProdMode = !isDevMode;

const getFilename = (ext) =>
  isDevMode ? `[name].${ext}` : `[name].[hash].${ext}`;

// const getJSLoader = ({ additionalPresets, additionalLoaders }) => {
// const getJSLoader = (settings) => {
const getJSLoader = ({ additionalPresets, additionalLoaders }) => {
  // const { additionalPresets, additionalLoaders } = settings;
  const options = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-proposal-class-properties'],
  };

  if (additionalPresets && additionalPresets !== 0) {
    options.presets.push(...additionalPresets);
  }
  const loaders = [
    {
      loader: 'babel-loader',
      options,
    },
  ];

  if (additionalLoaders && additionalLoaders !== 0) {
    loaders.push(additionalLoaders);
  }
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
    main: ['@babel/polyfill', './index.ts'],
  },
  output: {
    filename: getFilename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devtool: isDevMode ? 'inline-source-map' : false,
  devServer: {
    port: '8080',
    open: isDevMode,
  },
  optimization: optimization(),
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'assets', to: 'assets' }],
    }),
    new CleanWebpackPlugin(),
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
        use: getJSLoader({}),
      },
      {
        test: /\.jsx$/i,
        exclude: /node_modules/,
        use: getJSLoader({ additionalPresets: '@babel/preset-react' }),
      },
      {
        test: /\.ts$/i,
        exclude: /node_modules/,
        use: getJSLoader({ additionalLoaders: 'ts-loader' }),
      },
      {
        test: /\.tsx$/i,
        exclude: /node_modules/,
        use: getJSLoader({
          additionalPresets: '@babel/preset-react',
          additionalLoaders: 'ts-loader',
        }),
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
