import * as webpack from 'webpack';
import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const jsDist = 'js';
const cssDist = 'css';

const CI = !!process.env.CI;
const devMode = process.env.NODE_ENV !== 'production';
const publicPath = devMode ? '/' : process.env.PUBLIC_PATH ?? '/';
const fromCurrTo = (p: string) => path.resolve(__dirname, p);

const config: webpack.Configuration = {
  context: fromCurrTo('../'),
  entry: './src/index.tsx',
  output: {
    filename: devMode
      ? `${jsDist}/[name].js`
      : `${jsDist}/[name].[contenthash].js`,
    path: fromCurrTo('../dist'),
    publicPath,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      app: fromCurrTo('../src/app'),
      components: fromCurrTo('../src/components'),
      hooks: fromCurrTo('../src/hooks'),
      images: fromCurrTo('../src/images'),
      states: fromCurrTo('../src/states'),
      utils: fromCurrTo('../src/utils'),
    },
  },
  optimization: {
    runtimeChunk: 'single',
    minimizer: [
      '...',
      new CssMinimizerPlugin() as webpack.WebpackPluginInstance,
    ],
    splitChunks: {
      cacheGroups: {
        verdor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 10,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new BundleAnalyzerPlugin({ analyzerMode: CI ? 'disabled' : 'server' }),
    new MiniCssExtractPlugin({
      filename: devMode
        ? `${cssDist}/[name].css`
        : `${cssDist}/[name].[contenthash].css`,
      chunkFilename: devMode
        ? `${cssDist}/[id].css`
        : `${cssDist}/[id].[contenthash].css`,
      // TODO : wait until new updates for type of MiniCssExtractPlugin
    }) as any,
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: fromCurrTo('../src/index.html'),
    }),
    new CopyPlugin({
      patterns: [
        // Copy a default og image
        {
          from: fromCurrTo('../src/images/main.png'),
          to: 'images/[name].[ext]',
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          attributes: {
            root: fromCurrTo('../pages'),
          },
        },
      },
      {
        test: {
          and: [/.css$/i, { not: [/\.raw\.css$/i] }],
        },
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/inline',
      },
    ],
  },
};

export default config;
