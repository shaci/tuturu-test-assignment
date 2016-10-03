const webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        path: './app',
        filename: 'app.js',
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ],
    node: {
        fs: "empty"
    }
}