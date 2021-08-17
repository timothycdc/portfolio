/**
 * Webpack main configuration file
 */

const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');
const webpack = require('webpack')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
//Is it in development mod
let devMode = process.env.devMode || true;


const environment = require('./configuration/environment');

const templateFiles = fs.readdirSync(environment.paths.source)
    .filter((file) => path.extname(file).toLowerCase() === '.html');

const htmlPluginEntries = templateFiles.map((template) => new HTMLWebpackPlugin({
    inject: false,
    hash: false,
    filename: template,
    template: path.resolve(environment.paths.source, template),
    favicon: path.resolve(environment.paths.source, 'images', 'favicon.ico'),
}));

module.exports = {
    entry: {
        app: path.resolve(environment.paths.source, 'js', 'index.js'),
        test0: path.resolve(environment.paths.source, 'js', 'test0.js'),
        test1: path.resolve(environment.paths.source, 'js', 'test1.js'),
        test2: path.resolve(environment.paths.source, 'js', 'test2.js'),
        test3: path.resolve(environment.paths.source, 'js', 'test3.js'),
        test4: path.resolve(environment.paths.source, 'js', 'test4.js'),
        base: path.resolve(environment.paths.source, 'js', 'base.js'),
        base2: path.resolve(environment.paths.source, 'js', 'base2.js'),
        testx: path.resolve(environment.paths.source, 'js', 'testx.js'),

    },
    output: {
        filename: 'js/[name].js',
        path: environment.paths.output,
    },
    module: {
        rules: [{
                test: /\.((c|sa|sc)ss)$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(png|gif|jpe?g|svg)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: 'images/[name].[hash:6].[ext]',
                        publicPath: '../',
                        limit: environment.limits.images,
                    },
                }, ],
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[name].[hash:6].[ext]',
                        publicPath: '../',
                        limit: environment.limits.fonts,
                    },
                }, ],
            },
            {
                test: /\.json$/,
                type: 'asset/inline',
            },
            {
                test: /\.(glsl)$/,
                use: [{
                    loader: 'webpack-glsl-loader',
                    options: {
                        name: 'shaders/[name].[ext]',
                        publicPath: '../',
                        limit: environment.limits.gls,
                    },
                }, ],
            },
        ],
    },

    plugins: [
        /*new WebpackBundleAnalyzer(), */

        new webpack.ProvidePlugin({
            THREE: 'three'
        }),

        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        new ImageMinimizerPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            minimizerOptions: {
                // Lossless optimization with custom option
                // Feel free to experiment with options for better result for you
                plugins: [
                    ['gifsicle', { interlaced: true }],
                    ['jpegtran', { progressive: true }],
                    ['optipng', { optimizationLevel: 5 }],
                    [
                        'svgo',
                        {
                            plugins: extendDefaultPlugins([{
                                name: 'removeViewBox',
                                active: false,
                            }, ]),
                        },
                    ],
                ],
            },
        }),
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
        }),
        new CopyWebpackPlugin({
            patterns: [{
                    from: path.resolve(environment.paths.source, 'images'),
                    to: path.resolve(environment.paths.output, 'images'),
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', 'Thumbs.db'],
                    },
                },
                {
                    from: path.resolve(environment.paths.source, 'json'),
                    to: path.resolve(environment.paths.output, 'json'),
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', 'Thumbs.db'],
                    },

                },
                {
                    from: path.resolve(environment.paths.source, 'fonts'),
                    to: path.resolve(environment.paths.output, 'fonts'),
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', 'Thumbs.db'],
                    },

                },
            ],
        }),
    ].concat(htmlPluginEntries),
    target: 'web',


};