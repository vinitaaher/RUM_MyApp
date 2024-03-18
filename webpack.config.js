const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules:[
          {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
          },
          {
             test: /\.js$/,
             exclude: /node_modules/,
             use: {
                     loader: 'babel-loader',
                     options: {
                                  presets: ['@babel/preset-env']
                              }
                  }
          }
        ]
      },
      resolve: {
          fallback: {
              "path": false,
               "os": false,
               "http":false,
               "url":false
          }
      },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
     mode: 'development',
      output: {
        clean: true
      }
};
