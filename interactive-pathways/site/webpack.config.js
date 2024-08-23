const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].[contenthash].js',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'babel-loader',
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ],
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/i,
                    use: 'file-loader',
                },
                {
                    test: /\.html$/,
                    use: 'html-loader',
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ],
                },

            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
                'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://backend:8080'),
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
            }),
        ],
        resolve: {
            extensions: ['.js', '.jsx'],
            alias: {
                'assets': path.resolve(__dirname, 'src/assets'),
                'config': path.resolve(__dirname, 'src/config'),
                'reduxLocal': path.resolve(__dirname, 'src/redux'),
                'utils': path.resolve(__dirname, 'src/utils')
            }
        },
        mode: isProduction ? 'production' : 'development',
    };
};
