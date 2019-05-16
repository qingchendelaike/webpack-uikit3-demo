var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');//引入HtmlWebpackPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    // base source path
    context: path.resolve(__dirname, 'src'),

    // entry file names to compile
    entry: {
        app: [
            './js/app.js',
            './less/uikit3.theme.less',
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false, // set to true if you want JS source maps
                uglifyOptions: {
                    compress: {
                        unused: true,
                        warnings: false,
                        drop_debugger: true
                    },
                    output: {
                        comments: false
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: './'
    },
    plugins: [
        new CleanWebpackPlugin(),//删除dist
        new HtmlWebpackPlugin({
            title: 'Output Management', //表示 HTML title 标签的内容
            template: 'index.html',//表示模板路径
            minify: true,//压缩代码
            hash: true//加上哈希值来达到去缓存的目的
        }),
        new MiniCssExtractPlugin({filename: "css/[name].css",publicPath: "./"}),
    ],
    // enable source maps
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, '/src/'),
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            name: 'app.css',
                            publicPath: '../',
                        }
                    },
                    'css-loader',
                    'less-loader',
                ]
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: false,
                        attrs: [':data-src'],
                        outputPath: './images',
                        // publicPath: './images',
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            outputPath: './images/',
                            publicPath: './images',
                            limit: 8*1024,//8kb大小以下的图片文件都用base64处理
                            name: '[hash:8].[ext]',//// hash值为7位，ext自动补全文件扩展名
                        }
                    }
                ]
            },
            // {
            //     test: /\.(woff|woff2|eot|ttf|otf)$/,
            //     loader: "file-loader"
            // }
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                        loader: 'file-loader',
                        options: {
                            outputPath: './fonts/',
                            publicPath: "../fonts",
                            name: '[name].[ext]',//// hash值为7位，ext自动补全文件扩展名
                        }
                    }

            }
        ]
    },
};