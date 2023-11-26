const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'app.bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader','postcss-loader'],
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        },
     ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: 'index.html',
            title: 'ToDoIt',
            template: './src/index.html',
            myPageHeader: 'ToDoIt'
        }),
        new FaviconsWebpackPlugin('./src/asserts/img/icons8-double-tick-16.png'),
      ],
}