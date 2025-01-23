const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        average: './script/average.js',
        camembert: './script/camembert.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname),
        },
        compress: true,
        port: 9000,
    },
};