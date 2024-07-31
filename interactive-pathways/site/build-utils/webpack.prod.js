const webpack = require('webpack');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const UglifyJS = require("uglify-js");

const config = {
  mode: 'production',
  output: {
    filename: 'static/[name].[hash].js'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
         minify: UglifyJS.minify,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: [
            'default',
            {
              discardUnused: {
                removeAll: true,
              },
              discardComments: {
                removeAll: true,
              },
            },
          ],
        },
        canPrint: true
      }),
    ]
  },
};

module.exports = config;
