const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env) => {
    const shouldOpenAnalyzer = env.analyze;
    const isProd = process.env.NODE_ENV === 'production';

    return {
        entry: './src/index.tsx',
        devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
        output: {
            path: path.resolve(__dirname, './public/build/'),
            publicPath: '/build/',
            filename: '[name].[contenthash].js',
            chunkFilename: '[name].[contenthash].js',
            clean: true,
        },
        optimization: {
            minimize: isProd,
            runtimeChunk: 'single',
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                inject: 'body',
            }),
            ...(shouldOpenAnalyzer
                ? [new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: true })]
                : []),
        ],
        module: {
            rules: [
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: { filename: 'fonts/[hash][ext][query]' },
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/i,
                    type: 'asset/resource',
                    generator: { filename: 'images/[hash][ext][query]' },
                },
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: [/(node_modules)/],
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/env',
                            ['@babel/preset-react', { runtime: 'automatic' }],
                            '@babel/preset-typescript',
                        ],
                    },
                },
            ],
        },
        experiments: {
            css: true,
        },
        resolve: {
            alias: { '@components': path.resolve(__dirname, 'src/SharedComponents') },
            extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
        },
    };
};
