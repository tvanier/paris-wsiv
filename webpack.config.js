var webpack = require('webpack');
var path = require('path');
var projectRoot = path.resolve(__dirname);

module.exports = {
    entry: './src/wsiv.js',

    output: {
        path: 'dist/',
        filename: 'wsiv.js'
    },

    module: {
        loaders: [

            // https://github.com/babel/babel-loader
            {
                test: /src\/.*\.js$/,
                loader: 'babel',
                include: projectRoot,
                exclude: /node_modules/
            }
        ]
    }
}
