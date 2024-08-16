const commonPaths = require('./common-paths');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
require('dotenv').config();

const devMode = process.env.NODE_ENV !== 'production';

const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'API_URL': JSON.stringify(process.env.API_URL),
  }
};

const config = {
  entry: {
    vendor: ['semantic-ui-react'],
    app: [
      'babel-polyfill',
      `${commonPaths.appEntry}/index.js`,
    ],
    styles1: `${commonPaths.appEntry}/styling/main.scss`,
    styles2: `${commonPaths.appEntry}/styling/semantic.less`,
  },
  output: {
    path: commonPaths.outputPath,
    publicPath: '/'
  },
  resolve: {
    alias: {
      '../../theme.config$': path.resolve(__dirname, '../src/styling/theme.config'),
      heading: path.resolve(__dirname, '../src/styling/heading.less'),
    },
    modules: [
      path.join(__dirname, '../src/entry'),
      path.join(__dirname, '../src'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.json', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets:['@babel/preset-flow'],
          },
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'awesome-typescript-loader',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'images/[name].[hash].[ext]'
          }
        }],
      },
      {
        test: /\.html$/,
        use: {
          loader: 'raw-loader',
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 8192,
            name: 'fonts/[name].[hash].[ext]'
          }
        }],
      },
      {
        test: /\.less$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      },
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          test: 'vendor',
          name: 'vendor',
          enforce: true,
        },
        styles: {
          chunks: 'all',
          enforce: true,
          name: 'styles',
          test: /\.css$/,
        },
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `public/index.html`,
      favicon: `public/favicon.ico`
    }),
    new webpack.DefinePlugin(GLOBALS),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : 'static/[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : 'static/[id].[hash].css',
    }),
  ]
};

module.exports = config;