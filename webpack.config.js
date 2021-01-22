const path = require('path')

const config = {
  entry: './frontend/src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
    // publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      }
    ],
  },
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    },
    contentBase: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3001,
    publicPath: '/',
    historyApiFallback: { index: 'index.html' }
  },
  devtool: 'source-map',
  node: { __dirname: true },
}

module.exports = config
