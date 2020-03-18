require('@babel/register')
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require("favicons-webpack-plugin")

const src  = path.resolve(__dirname, 'frontend')
const dist = path.resolve(__dirname, 'static')

module.exports = {
    mode: 'development',
    entry: src + '/index.jsx',

    output: {
        path: dist,
        filename: 'bundle.js',
        publicPath: ""
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.txt$/i,
                use: 'raw-loader',
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: src + '/index.html',
            filename: 'index.html'
        }),
        new FaviconsWebpackPlugin({
            logo: src + '/resource/favicon.png',
            mode: "light",
            devMode: 'light',
        }),
    ]
}