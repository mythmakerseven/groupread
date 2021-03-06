import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  entry: './frontend/src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.(tsx|js)$/,
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript'
          ]
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          require.resolve('style-loader'),
          // Translates CSS into CommonJS
          require.resolve('css-loader'),
          // Compiles Sass to CSS
          require.resolve('sass-loader'),
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|webp|woff|woff2)$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
        },
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.js']
  },
  devServer: {
    proxy: {
      '/api': `http://localhost:${process.env.PORT}`
    },
    contentBase: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3001,
    publicPath: '/',
    historyApiFallback: { index: 'index.html' },
    inline: true
  },
  devtool: 'source-map',
  node: { __dirname: true },
}

// This needs to stay an old-fashioned module export because cypress relies on it
module.exports = config
